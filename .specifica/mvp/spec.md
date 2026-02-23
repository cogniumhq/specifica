# Reference Site MVP

The minimum viable reference site that explains Specifica clearly and completely.

## What it does

A single-page static website that documents the Specifica format. Visitors should understand what Specifica is, how to use it, and why it's designed this way.

## Requirements

### Content sections

- [ ] Hero with tagline and directory tree visualization
- [ ] Statement band explaining the format philosophy
- [ ] Three-file explanation (spec.md, design.md, tasks.md)
- [ ] Complete directory structure with annotations
- [ ] Conventions section with code examples
- [ ] Principles section (5-7 core rules)
- [ ] CTA with terminal commands for getting started
- [ ] Navigation and footer

### Visual design

- [ ] Eucalyptus green brand color (#1a7a56)
- [ ] Sora font for UI text
- [ ] JetBrains Mono for code and monospace
- [ ] Dark code blocks for examples
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Smooth scroll animations for reveals
- [ ] Check-Doc logo mark in nav and footer

### Code examples

- [ ] Hero tree showing `.specifica/` structure
- [ ] File preview cards with realistic content
- [ ] Full directory tree with annotations
- [ ] Convention examples (good/bad patterns)
- [ ] Terminal commands for getting started

### Performance

- [ ] Single HTML file (no build step)
- [ ] Inline CSS and minimal JS
- [ ] Load in under 1 second on 3G
- [ ] No external dependencies except fonts

### Links and navigation

- [ ] Link to GitHub repository
- [ ] Link to specifica.app (web editor)
- [ ] Internal anchor links to sections
- [ ] Mobile-friendly navigation

### Versioning (future)

- [ ] Display format version in footer or nav (e.g., "v0.1 draft")
- [ ] Use semantic versioning for the format specification
- [ ] Generate index.html from source/template based on version
- [ ] Track version changes in git tags
- [ ] Cloudflare Pages builds HTML from versioned source on deploy

**Rationale**: As the Specifica format evolves, we need to version it clearly. Building index.html from a template system would allow us to maintain consistency and track changes more easily than editing a large HTML file directly.

**Deferred to**: Post-MVP. Current single-file approach is simpler for initial launch.

## Edge cases

Site loads without JavaScript → content still readable. User visits on mobile → responsive layout adapts. User has slow connection → page loads progressively. User prefers reduced motion → animations disabled.
