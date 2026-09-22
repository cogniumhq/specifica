# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository holds the **Specifica format specification** and its two
TypeScript packages. Built by [Cognium Labs Inc](https://cognium.net).

Specifica is a `.specifica/` directory convention for writing software specs as
markdown in any Git repo: three files per feature — `spec.md` (what),
`design.md` (how), `tasks.md` (work). Tool-agnostic, and deliberately useful
without any tool.

**Philosophy**: make specification the natural first step of building software,
not a chore teams skip. The format gives structure; the app removes friction.

**Key distinction**: `specifica.org` presents an open standard anyone can
adopt. `specifica.app` is one tool that implements it. The format must always
be useful without the app.

## How the pieces fit

The project is three repositories. Put changes where the thing lives:

| Repo | Contents |
|---|---|
| **specifica** (this repo) | `.specifica/` format spec, `@specifica/format`, `@specifica/store` |
| `cogniumhq/specifica-web` | the specifica.org reference site (`index.html`, Cloudflare Pages) |
| `cogniumhq/specifica-app` | the specifica.app web editor |

The site used to live here. It was split out so that a copy edit to the website
and a release of the npm packages are no longer the same blast radius — see
cogniumhq/cognium-dev#442 for the related ownership work.

## Layout

```
.
├── .specifica/          # the format's own spec, written in the format
│   ├── principles.md
│   ├── spec.md
│   └── mvp/{spec,design,tasks}.md
└── packages/
    ├── format/          # @specifica/format — parse/serialize, ~200 lines, zero deps
    └── store/           # @specifica/store  — StorageAdapter types only
```

`.specifica/` is dogfooding: the format's own specification is written in the
format. Changes to the convention should be reflected there.

## Common tasks

```bash
npm install        # npm workspaces
npm run build      # build both packages
npm test           # vitest
npm run clean      # remove build artifacts
```

Both packages are published to npm (`@specifica/format`, `@specifica/store`,
MIT). Publishing is manual — there are no release workflows in this repo — so
treat a version bump as a deliberate act, not a side effect.

## Conventions

- `@specifica/format` is intentionally tiny and dependency-free. Adding a
  runtime dependency to it is a decision, not a detail: it ships to every
  consumer of the format.
- `@specifica/store` is types and interfaces only — no implementation. Keep
  storage backends out of it.
- Status is v0.1 draft; copy should reflect the evolving nature of the format.
