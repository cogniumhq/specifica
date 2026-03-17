/**
 * @specifica/format - Pure TypeScript parser and serializer for the Specifica format
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Task {
  title: string
  done: boolean
  order: number
}

export interface Item {
  slug: string
  spec?: string
  design?: string
  tasks?: Task[]
  metadata?: Record<string, string>
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

// ─── Task Parsing ────────────────────────────────────────────────────────────

const CHECKBOX_PATTERN = /^- \[([ x])\] (.+)$/

/**
 * Parse tasks.md markdown into structured Task array
 * Handles GitHub-Flavored Markdown checkbox format: - [ ] or - [x]
 */
export function parseTasks(tasksMd: string): Task[] {
  const lines = tasksMd.split('\n')
  const tasks: Task[] = []
  let order = 0

  for (const line of lines) {
    const trimmed = line.trim()
    const match = trimmed.match(CHECKBOX_PATTERN)

    if (match) {
      const [, checkbox, title] = match
      tasks.push({
        title: title.trim(),
        done: checkbox.toLowerCase() === 'x',
        order: order++
      })
    }
  }

  return tasks
}

/**
 * Serialize Task array back to tasks.md markdown
 */
export function serializeTasks(tasks: Task[]): string {
  return tasks
    .sort((a, b) => a.order - b.order)
    .map(task => `- [${task.done ? 'x' : ' '}] ${task.title}`)
    .join('\n')
}

// ─── Frontmatter ─────────────────────────────────────────────────────────────

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

/**
 * Extract YAML frontmatter from markdown content
 * Returns [metadata, content without frontmatter]
 */
function extractFrontmatter(content: string): [Record<string, string> | undefined, string] {
  const match = content.match(FRONTMATTER_PATTERN)

  if (!match) {
    return [undefined, content]
  }

  const [, yamlBlock, body] = match
  const metadata: Record<string, string> = {}

  // Simple YAML parser for key: value pairs
  const lines = yamlBlock.split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()
      metadata[key] = value
    }
  }

  return [Object.keys(metadata).length > 0 ? metadata : undefined, body]
}

/**
 * Add frontmatter to markdown content
 */
function addFrontmatter(metadata: Record<string, string>, content: string): string {
  const yamlLines = Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  return `---\n${yamlLines}\n---\n${content}`
}

// ─── Parse & Serialize ───────────────────────────────────────────────────────

/**
 * Parse Specifica item from markdown files
 * All files are optional - handles gracefully
 */
export function parse(
  slug: string,
  specMd?: string,
  designMd?: string,
  tasksMd?: string
): Item {
  const item: Item = { slug }

  // Parse spec.md with optional frontmatter
  if (specMd !== undefined) {
    const [metadata, content] = extractFrontmatter(specMd)
    item.spec = content
    if (metadata) {
      item.metadata = metadata
    }
  }

  // Parse design.md (raw markdown)
  if (designMd !== undefined) {
    item.design = designMd
  }

  // Parse tasks.md (structured)
  if (tasksMd !== undefined) {
    item.tasks = parseTasks(tasksMd)
  }

  return item
}

/**
 * Serialize Item back to markdown files
 * Returns only the files that have content
 */
export function serialize(item: Item): {
  spec?: string
  design?: string
  tasks?: string
} {
  const result: { spec?: string; design?: string; tasks?: string } = {}

  // Serialize spec.md with optional frontmatter
  if (item.spec !== undefined) {
    if (item.metadata && Object.keys(item.metadata).length > 0) {
      result.spec = addFrontmatter(item.metadata, item.spec)
    } else {
      result.spec = item.spec
    }
  }

  // Serialize design.md
  if (item.design !== undefined) {
    result.design = item.design
  }

  // Serialize tasks.md
  if (item.tasks !== undefined && item.tasks.length > 0) {
    result.tasks = serializeTasks(item.tasks)
  }

  return result
}

// ─── Validation ──────────────────────────────────────────────────────────────

const KEBAB_CASE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

/**
 * Validate Specifica directory structure and content
 */
export function validate(files: Record<string, string>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for directory name (slug)
  const slug = files['__slug']
  if (slug) {
    if (!KEBAB_CASE_PATTERN.test(slug)) {
      errors.push(`Directory name must be kebab-case: ${slug}`)
    }
  }

  // Validate spec.md frontmatter if present
  if (files['spec.md']) {
    const [metadata, content] = extractFrontmatter(files['spec.md'])
    if (metadata && content.trim() === '') {
      warnings.push('spec.md has frontmatter but no content')
    }
  }

  // Validate tasks.md format
  if (files['tasks.md']) {
    const tasks = parseTasks(files['tasks.md'])
    if (tasks.length === 0 && files['tasks.md'].trim() !== '') {
      warnings.push('tasks.md has content but no valid checkboxes')
    }
  }

  // Check for empty files
  for (const [filename, content] of Object.entries(files)) {
    if (filename !== '__slug' && content.trim() === '') {
      warnings.push(`${filename} is empty`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Convert a title to kebab-case slug
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Check if a string is valid kebab-case
 */
export function isKebabCase(str: string): boolean {
  return KEBAB_CASE_PATTERN.test(str)
}
