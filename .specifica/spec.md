# Specifica Reference Site [draft]

The definitive documentation for the Specifica specification format.

## What is this project?

This repository contains the reference website for Specifica (`specifica.org`) — a static documentation site that defines the open Specifica format. The site explains the directory structure, file conventions, and principles that make up the Specifica specification format.

## Success criteria

- [ ] Complete documentation of the `.specifica/` directory convention
- [ ] Clear explanation of the three-file format (spec.md, design.md, tasks.md)
- [ ] Visual examples showing directory structure and file contents
- [ ] Explanation of all conventions and principles
- [ ] Mobile-responsive and accessible design
- [ ] Fast load time (< 1s on 3G)
- [ ] Deployable to Cloudflare Pages at `specifica.org`
- [ ] Clear distinction between the format (open) and the app (one implementation)

## Scope

**In scope:**
- Documentation of the Specifica format specification
- Examples of `.specifica/` directory structures
- Conventions for writing spec.md, design.md, and tasks.md files
- Principles that guide the format
- Visual design and branding for the reference site
- Static HTML/CSS implementation

**Out of scope:**
- The web application (specifica.app) — that's a separate project
- Interactive spec editing features
- GitHub integration or OAuth
- Any backend services or APIs
- Build tools or bundlers (site is a single HTML file)

## Time appetite

6 weeks for v1.0 of the format documentation and reference site.

## Non-goals

- Building a spec editor or management tool (that's specifica.app)
- Creating a proprietary format that requires specific tooling
- Competing with existing spec tools on features — we win on simplicity
- Supporting nested feature directories or complex hierarchies
- Allowing format customization or configuration files
