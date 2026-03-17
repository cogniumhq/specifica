# @specifica/format

Pure TypeScript parser and serializer for the [Specifica format](https://specifica.org).

## Installation

```bash
npm install @specifica/format
```

## Usage

```typescript
import { parse, serialize, parseTasks, serializeTasks } from '@specifica/format'

// Parse an item from markdown files
const item = parse(
  'my-feature',
  '# Feature\n\nDescription here.',  // spec.md
  '# Design\n\nImplementation.',     // design.md
  '- [ ] Task 1\n- [x] Task 2'       // tasks.md
)

console.log(item.slug)        // 'my-feature'
console.log(item.spec)        // '# Feature...'
console.log(item.tasks)       // [{ title: 'Task 1', done: false, order: 0 }, ...]

// Serialize back to markdown
const files = serialize(item)
console.log(files.spec)       // '# Feature...'
console.log(files.tasks)      // '- [ ] Task 1\n- [x] Task 2'

// Work with tasks directly
const tasks = parseTasks('- [ ] Do this\n- [x] Done')
console.log(tasks[0])         // { title: 'Do this', done: false, order: 0 }

const markdown = serializeTasks(tasks)
console.log(markdown)         // '- [ ] Do this\n- [x] Done'
```

## API

### `parse(slug, spec?, design?, tasks?): Item`

Parse Specifica item from markdown files. All files are optional.

### `serialize(item): { spec?, design?, tasks? }`

Serialize an Item back to markdown files.

### `parseTasks(tasksMd): Task[]`

Parse tasks.md checkboxes into structured Task array.

### `serializeTasks(tasks): string`

Serialize Task array back to markdown checkboxes.

### `validate(files): ValidationResult`

Validate directory structure and content.

### `slugify(title): string`

Convert a title to kebab-case slug.

### `isKebabCase(str): boolean`

Check if a string is valid kebab-case.

## Types

```typescript
interface Item {
  slug: string
  spec?: string
  design?: string
  tasks?: Task[]
  metadata?: Record<string, string>
}

interface Task {
  title: string
  done: boolean
  order: number
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}
```

## Features

- **Pure TypeScript** - No dependencies
- **Frontmatter support** - Optional YAML metadata in spec.md
- **Graceful parsing** - Handles malformed content
- **Roundtrip safe** - Parse and serialize without data loss
- **~200 lines** - Small, focused, maintainable

## License

MIT
