# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the Specifica reference site (`specifica.org`) - a static HTML website that documents the open Specifica specification format.

**Specifica is two things:**

1. **specifica.org** — An open specification format. A `.specifica/` directory convention for writing software specs as markdown in any Git repo. Three files per feature: `spec.md` (what), `design.md` (how), `tasks.md` (work). Tool-agnostic — works with any editor, any workflow.

2. **specifica.app** — A web application that makes the format easy. Sign in with GitHub, connect a repo, refine specs through LLM chat, commit changes. Goal: sign-in to first commit in under 20 minutes, no terminal needed.

**Philosophy**: Make specification the natural first step of building software — not a chore teams skip. The format gives structure. The app removes friction. Together they close the gap between "we should spec this" and specs actually existing in the repo.

**Inspiration**: A simplified Spec Kit that anybody can create easily.

**Current state**: The format is defined and documented. This reference site (`specifica.org`) is built and ready to deploy to Cloudflare Pages (`specifica.pages.dev`). The MVP app has a complete spec, design, and task breakdown across 5 phases (10 days). Brand system is finalized (eucalyptus green, Sora + JetBrains Mono, Check-Doc logo mark).

**Key distinction**: `specifica.org` presents an open standard that anyone can adopt. `specifica.app` is one tool that implements it. The format must always be useful without the app.

## Architecture

**Single-file static site**: The entire site is contained in `index.html` - a self-contained HTML file with inline CSS and minimal JavaScript.

**Design system**:
- Custom CSS variables defined in `:root` for colors, typography, spacing, and animations
- Two main fonts: Sora (UI) and JetBrains Mono (code/monospace)
- Color palette centers around a green theme (`--green: #1a7a56`) with dark mode elements
- Responsive breakpoint at 900px

**Key sections** (in order):
1. Nav - Fixed header with logo and navigation links
2. Hero - Two-column grid with headline and directory tree visualization
3. Statement - Full-width text band explaining the format
4. Three Files - Card grid explaining spec.md, design.md, tasks.md
5. Structure - Dark section with tree diagram and annotations
6. Conventions - Grid of convention cards with code examples
7. Principles - Five numbered principles
8. CTA - Call-to-action with terminal example
9. Footer - Simple footer with links

**Interactive features**:
- Scroll-based nav border reveal
- Intersection Observer for `.reveal` animations
- No frameworks or build tools

## File Structure

```
.
├── index.html    # Complete standalone site
└── .git/         # Git repository
```

## Common Tasks

**Local development**: Open `index.html` directly in a browser - no build step or local server required.

**Deployment**: This is a static file. Deploy by serving `index.html` from any static hosting provider (Cloudflare Pages, Netlify, GitHub Pages, etc.).

**Editing content**: All content is in `index.html`. Modify the HTML within the semantic sections (`.hero`, `.statement`, `.three-files`, etc.).

**Styling changes**: Edit the CSS in the `<style>` block. CSS is organized by section with clear comment headers.

## Design Patterns

**Color classes in code blocks**:
- `.ht-*` classes: Hero tree colors (dir, conn, file, feature, note)
- `.fp-*` classes: File preview colors (heading, text, check, bold, key)
- `.g`, `.r`, `.d`, `.w`, `.c`: Convention example colors (green, red, divider, white, comment)

**Reveal animations**: Add `.reveal` class to any element to trigger fade-in-up animation on scroll.

**Terminal styling**: Use `.cta-terminal` structure with traffic light dots (`.td-r`, `.td-y`, `.td-g`) and colored spans (`.p` prompt, `.c` command, `.m` comment).

## Content Guidelines

This site explains Specifica's conventions. When editing:
- Keep code examples authentic - they demonstrate real usage patterns
- Maintain the three-file philosophy (spec.md, design.md, tasks.md)
- Preserve the hierarchy: project-level files vs. feature folders
- Status is v0.1 draft - reflect evolving nature in copy
