import { describe, it, expect } from 'vitest'
import {
  parseTasks,
  serializeTasks,
  parse,
  serialize,
  validate,
  slugify,
  isKebabCase,
  type Task,
  type Item
} from './index.js'

describe('parseTasks', () => {
  it('should parse basic checkboxes', () => {
    const md = `- [ ] Task one\n- [x] Task two\n- [ ] Task three`
    const tasks = parseTasks(md)

    expect(tasks).toHaveLength(3)
    expect(tasks[0]).toEqual({ title: 'Task one', done: false, order: 0 })
    expect(tasks[1]).toEqual({ title: 'Task two', done: true, order: 1 })
    expect(tasks[2]).toEqual({ title: 'Task three', done: false, order: 2 })
  })

  it('should handle empty content', () => {
    expect(parseTasks('')).toEqual([])
  })

  it('should ignore non-checkbox lines', () => {
    const md = `# Header\n- [ ] Valid task\nNormal text\n- [x] Another task`
    const tasks = parseTasks(md)

    expect(tasks).toHaveLength(2)
    expect(tasks[0].title).toBe('Valid task')
    expect(tasks[1].title).toBe('Another task')
  })

  it('should handle malformed checkboxes gracefully', () => {
    const md = `- [] Missing space\n- [ ] Valid\n-[ ] No space before bracket`
    const tasks = parseTasks(md)

    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('Valid')
  })

  it('should trim whitespace from titles', () => {
    const md = `- [ ]   Lots of spaces   `
    const tasks = parseTasks(md)

    expect(tasks[0].title).toBe('Lots of spaces')
  })
})

describe('serializeTasks', () => {
  it('should serialize tasks to markdown', () => {
    const tasks: Task[] = [
      { title: 'First', done: false, order: 0 },
      { title: 'Second', done: true, order: 1 },
      { title: 'Third', done: false, order: 2 }
    ]

    const md = serializeTasks(tasks)
    expect(md).toBe('- [ ] First\n- [x] Second\n- [ ] Third')
  })

  it('should handle empty array', () => {
    expect(serializeTasks([])).toBe('')
  })

  it('should sort by order', () => {
    const tasks: Task[] = [
      { title: 'Third', done: false, order: 2 },
      { title: 'First', done: false, order: 0 },
      { title: 'Second', done: false, order: 1 }
    ]

    const md = serializeTasks(tasks)
    expect(md).toBe('- [ ] First\n- [ ] Second\n- [ ] Third')
  })
})

describe('parse and serialize roundtrip', () => {
  it('should roundtrip complete item', () => {
    const specMd = '# Feature\n\nThis is a spec.'
    const designMd = '# Design\n\nImplementation details.'
    const tasksMd = '- [ ] Task 1\n- [x] Task 2'

    const item = parse('my-feature', specMd, designMd, tasksMd)
    const serialized = serialize(item)

    expect(item.slug).toBe('my-feature')
    expect(item.spec).toBe(specMd)
    expect(item.design).toBe(designMd)
    expect(item.tasks).toHaveLength(2)

    expect(serialized.spec).toBe(specMd)
    expect(serialized.design).toBe(designMd)
    expect(serialized.tasks).toBe(tasksMd)
  })

  it('should handle optional files', () => {
    const item = parse('minimal', undefined, undefined, '- [ ] Only tasks')

    expect(item.spec).toBeUndefined()
    expect(item.design).toBeUndefined()
    expect(item.tasks).toHaveLength(1)

    const serialized = serialize(item)
    expect(serialized.spec).toBeUndefined()
    expect(serialized.design).toBeUndefined()
    expect(serialized.tasks).toBe('- [ ] Only tasks')
  })

  it('should handle frontmatter in spec.md', () => {
    const specWithFrontmatter = `---
version: 1.0
status: draft
---
# Content

Body text.`

    const item = parse('feature', specWithFrontmatter)

    expect(item.metadata).toEqual({ version: '1.0', status: 'draft' })
    expect(item.spec).toBe('# Content\n\nBody text.')

    const serialized = serialize(item)
    expect(serialized.spec).toContain('---')
    expect(serialized.spec).toContain('version: 1.0')
    expect(serialized.spec).toContain('# Content')
  })

  it('should handle item without frontmatter', () => {
    const spec = '# Just content'
    const item = parse('simple', spec)

    expect(item.metadata).toBeUndefined()
    expect(item.spec).toBe(spec)

    const serialized = serialize(item)
    expect(serialized.spec).toBe(spec)
  })

  it('should not serialize empty tasks array', () => {
    const item: Item = {
      slug: 'empty-tasks',
      spec: 'Content',
      tasks: []
    }

    const serialized = serialize(item)
    expect(serialized.tasks).toBeUndefined()
  })
})

describe('validate', () => {
  it('should validate kebab-case directory names', () => {
    const result = validate({ __slug: 'valid-feature-name' })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject non-kebab-case names', () => {
    const result = validate({ __slug: 'Invalid_Name' })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Directory name must be kebab-case: Invalid_Name')
  })

  it('should reject camelCase', () => {
    const result = validate({ __slug: 'camelCase' })
    expect(result.valid).toBe(false)
  })

  it('should warn about empty files', () => {
    const result = validate({
      __slug: 'my-feature',
      'spec.md': '',
      'design.md': 'Content'
    })

    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('spec.md is empty')
  })

  it('should warn about tasks.md with no checkboxes', () => {
    const result = validate({
      __slug: 'my-feature',
      'tasks.md': 'Just some text without checkboxes'
    })

    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('tasks.md has content but no valid checkboxes')
  })

  it('should warn about frontmatter with no content', () => {
    const result = validate({
      __slug: 'my-feature',
      'spec.md': '---\nversion: 1.0\n---\n'
    })

    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('spec.md has frontmatter but no content')
  })

  it('should accept valid structure', () => {
    const result = validate({
      __slug: 'my-feature',
      'spec.md': '# Spec',
      'design.md': '# Design',
      'tasks.md': '- [ ] Task'
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
  })
})

describe('slugify', () => {
  it('should convert to kebab-case', () => {
    expect(slugify('My Feature Name')).toBe('my-feature-name')
  })

  it('should handle special characters', () => {
    expect(slugify('Feature #1: User Auth!')).toBe('feature-1-user-auth')
  })

  it('should remove leading/trailing dashes', () => {
    expect(slugify('  Feature  ')).toBe('feature')
  })

  it('should collapse multiple dashes', () => {
    expect(slugify('Multiple   Spaces')).toBe('multiple-spaces')
  })
})

describe('isKebabCase', () => {
  it('should accept valid kebab-case', () => {
    expect(isKebabCase('valid-feature')).toBe(true)
    expect(isKebabCase('my-feature-123')).toBe(true)
    expect(isKebabCase('feature')).toBe(true)
  })

  it('should reject invalid formats', () => {
    expect(isKebabCase('camelCase')).toBe(false)
    expect(isKebabCase('PascalCase')).toBe(false)
    expect(isKebabCase('snake_case')).toBe(false)
    expect(isKebabCase('UPPERCASE')).toBe(false)
    expect(isKebabCase('has spaces')).toBe(false)
    expect(isKebabCase('-leading-dash')).toBe(false)
    expect(isKebabCase('trailing-dash-')).toBe(false)
  })
})
