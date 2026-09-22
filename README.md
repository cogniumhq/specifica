# Specifica by Cognium

[![Cognium Labs Inc](https://img.shields.io/badge/Cognium_Labs_Inc-cognium.net-0a0a0b?labelColor=6ee7b7&color=111111)](https://cognium.net)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**An open specification format for writing software specs in Git repositories.**
[Specifica](https://specifica.org) is built by
**[Cognium Labs Inc](https://cognium.net)**. This MIT-licensed repository
contains the format specification and its two TypeScript packages; the
reference site and the web editor live in their own repositories.

## What is Specifica?

A `.specifica/` directory convention for writing software specs as markdown in
any Git repo. Three files per feature: `spec.md` (what), `design.md` (how),
`tasks.md` (work). Tool-agnostic — works with any editor, any workflow.

```
.specifica/
├── principles.md          # Project context and memory
└── feature-name/          # kebab-case directory
    ├── spec.md           # What (requirements, success criteria)
    ├── design.md         # How (architecture, implementation)
    └── tasks.md          # Work (checkboxes)
```

All files are optional. All files are standard GitHub-Flavored Markdown.

## How the pieces fit

| Repo | Contents |
|---|---|
| **specifica** (this repo) | the `.specifica/` format specification, `@specifica/format`, `@specifica/store` |
| [specifica-web](https://github.com/cogniumhq/specifica-web) | the [specifica.org](https://specifica.org) reference site |
| [specifica-app](https://github.com/cogniumhq/specifica-app) | the [specifica.app](https://specifica.app) web editor |

## Packages

### [@specifica/format](./packages/format)

Pure TypeScript library for parsing and serializing the Specifica format.
~200 lines, zero dependencies.

```bash
npm install @specifica/format
```

```typescript
import { parse, serialize } from '@specifica/format'

const item = parse('my-feature', specMd, designMd, tasksMd)
const files = serialize(item)
```

### [@specifica/store](./packages/store)

Storage adapter interface for Specifica-compatible backends. TypeScript types
and interfaces only.

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

A monorepo using npm workspaces.

```bash
npm install        # install dependencies
npm run build      # build all packages
npm test           # run tests
npm run clean      # clean build artifacts
```

## Philosophy

Make specification the natural first step of building software — not a chore
teams skip. The format gives structure. The app removes friction. Together they
close the gap between "we should spec this" and specs actually existing in the
repo.

## About Cognium

[Cognium Labs Inc](https://cognium.net) builds Specifica,
[SkillsRegistry](https://skillsregistry.net) and
[Cognium SAST](https://cognium.dev). The company site is
[cognium.net](https://cognium.net); [specifica.org](https://specifica.org)
documents the open spec format. Other open work is at
[github.com/cogniumhq](https://github.com/cogniumhq). Contact:
[hello@cognium.net](mailto:hello@cognium.net).

## Contributing

External contributions are welcome; no separate CLA form is required. See
[CONTRIBUTING.md](CONTRIBUTING.md) and open an issue before starting
non-trivial work — particularly for changes to the format itself, which other
tools implement.

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). To report
a vulnerability privately, see the [security policy](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE).

Both packages are published to npm under the same terms. Publishing is manual;
there are no release workflows in this repository.

## Links

- [specifica.org](https://specifica.org) — format documentation
- [specifica.app](https://specifica.app) — web application (coming soon)

---

*[Cognium Labs Inc](https://cognium.net) · 2026*
