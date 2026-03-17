# Specifica

Open specification format for writing software specs in Git repositories.

## What is Specifica?

Specifica is two things:

1. **specifica.org** — An open specification format. A `.specifica/` directory convention for writing software specs as markdown in any Git repo. Three files per feature: `spec.md` (what), `design.md` (how), `tasks.md` (work). Tool-agnostic — works with any editor, any workflow.

2. **specifica.app** — A web application that makes the format easy. Sign in with GitHub, connect a repo, refine specs through LLM chat, commit changes. Goal: sign-in to first commit in under 20 minutes, no terminal needed.

## This Repository

This repository contains:

- **specifica.org** - The reference site documenting the format ([index.html](./index.html))
- **@specifica/format** - Pure TypeScript parser and serializer ([packages/format](./packages/format))
- **@specifica/store** - Storage adapter interface ([packages/store](./packages/store))

## Packages

### [@specifica/format](./packages/format)

Pure TypeScript library for parsing and serializing the Specifica format. ~200 lines, zero dependencies.

```bash
npm install @specifica/format
```

```typescript
import { parse, serialize } from '@specifica/format'

const item = parse('my-feature', specMd, designMd, tasksMd)
const files = serialize(item)
```

### [@specifica/store](./packages/store)

Storage adapter interface for Specifica-compatible backends. TypeScript types and interfaces only.

```bash
npm install @specifica/store
```

```typescript
import type { StorageAdapter } from '@specifica/store'

class MyAdapter implements StorageAdapter {
  // Implement the interface
}
```

## Development

This is a monorepo using npm workspaces.

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Clean build artifacts
npm run clean
```

## Format Overview

```
.specifica/
├── principles.md          # Project context and memory
└── feature-name/          # kebab-case directory
    ├── spec.md           # What (requirements, success criteria)
    ├── design.md         # How (architecture, implementation)
    └── tasks.md          # Work (checkboxes)
```

All files are optional. All files are standard GitHub-Flavored Markdown.

## Philosophy

Make specification the natural first step of building software — not a chore teams skip. The format gives structure. The app removes friction. Together they close the gap between "we should spec this" and specs actually existing in the repo.

## License

MIT

## Links

- [specifica.org](https://specifica.org) - Format documentation
- [specifica.app](https://specifica.app) - Web application (coming soon)
