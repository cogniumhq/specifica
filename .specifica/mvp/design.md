# Reference Site — Design

Technical architecture and design decisions for the static reference site.

## Architecture

**Single-file static site**
- One `index.html` file contains everything
- Inline `<style>` block with all CSS
- Inline `<script>` block with minimal JS
- No build process, bundler, or compilation
- No external dependencies except Google Fonts

**Why single-file?**
- Zero deployment complexity
- Works offline after first load
- Demonstrates simplicity (our core value)
- Fast page load (no cascade of requests)
- Can be viewed locally with `open index.html`

## Design system

**Colors** (CSS variables in `:root`)
```
--green: #1a7a56         (brand primary)
--green-hover: #15694a   (interactive states)
--green-subtle: #e8f5ee  (backgrounds)
--text-primary: #18181b  (body text)
--text-secondary: #52525b (supporting text)
--dark: #111113          (code blocks)
```

**Typography**
- UI: Sora (400, 500, 600, 700) from Google Fonts
- Code: JetBrains Mono (400, 500) from Google Fonts
- Base size: 15px with 1.6 line-height
- Headings use negative letter-spacing for tighter feel

**Layout**
- Max-width wrapper: 1080px
- Padding: 40px on desktop, 24px on mobile
- Responsive breakpoint: 900px
- Grid-based sections (2-col, 3-col)

**Components**
- `.reveal` class for scroll-triggered fade-in animations
- `.hero-tree` for directory visualization
- `.file-card` for three-file explanation
- `.tree-visual` for structure section
- `.conv-card` for convention examples
- `.cta-terminal` for terminal command display

## Page sections

```
Nav (fixed)
  ↓
Hero (2-col grid: text + tree)
  ↓
Statement (full-width text band)
  ↓
Three Files (3-col card grid)
  ↓
Structure (dark section, tree + annotations)
  ↓
Conventions (2-col card grid)
  ↓
Principles (numbered list)
  ↓
CTA (centered with terminal)
  ↓
Footer
```

## Interactive features

**Scroll animations**
- IntersectionObserver watches `.reveal` elements
- Fade-in + translateY(20px → 0) on viewport entry
- Threshold: 0.12, rootMargin: -40px
- Respects `prefers-reduced-motion`

**Nav border**
- Transparent by default
- `border-bottom: 1px solid var(--border)` after 10px scroll
- Smooth transition on scroll event

**No JavaScript required for**
- Content rendering
- Layout
- Navigation (anchor links)
- Responsive behavior

## Code block styling

**Multiple color schemes for different contexts:**
- `.ht-*` classes: Hero tree (dir, conn, file, feature, note)
- `.fp-*` classes: File previews (heading, text, check, bold, key)
- Convention examples: `.g` (good), `.r` (bad), `.d` (divider), `.w` (white), `.c` (comment)

All use dark background (#111113) with syntax-appropriate foreground colors.

## Key decisions

**1. Single HTML file instead of build process**
- Makes the site itself an example of simplicity
- No npm, no bundler, no config files
- Trade-off: harder to maintain large amounts of content, but site is intentionally small

**2. Inline fonts instead of self-hosted**
- Google Fonts for Sora + JetBrains Mono
- Trade-off: external dependency and GDPR consideration, but significantly simpler
- Can self-host later if needed

**3. Minimal JavaScript (scroll observer only)**
- Page is fully functional without JS
- JS only enhances with animations
- Trade-off: could use a framework, but that contradicts our simplicity principle

**4. No syntax highlighter library**
- Custom color classes (`.g`, `.r`, `.fp-heading`, etc.)
- Trade-off: manual markup of code examples, but keeps site lightweight

**5. Dark code blocks on light page**
- Terminal/code sections use dark theme (#111113 background)
- Main page uses light theme
- Provides visual distinction and focuses attention on code examples

## Deployment

**Target: Cloudflare Pages**
- Domain: `specifica.org`
- Preview: `specifica.pages.dev`
- Build command: (none — static file)
- Output directory: `/` (root)

**Deploy process:**
1. Push to `main` branch
2. Cloudflare Pages auto-deploys `index.html`
3. Site live at specifica.org

No build step, no environment variables, no serverless functions.

## Versioning & Build System (Future)

**Current state**: Single `index.html` file edited directly. Version shown as "v0.1 draft" in hero meta section.

**Future state**: Template-based build system that generates `index.html` from versioned source files.

**Semantic versioning for the format**
- MAJOR: Breaking changes to `.specifica/` structure or file conventions
- MINOR: New conventions or optional additions (e.g., new status tags)
- PATCH: Documentation clarifications, typo fixes, example updates

**Potential build approach**
```
src/
├── version.json          # { "version": "1.0.0", "status": "stable" }
├── template.html         # HTML with {{version}} placeholders
├── sections/             # Modular content sections
│   ├── hero.html
│   ├── three-files.html
│   └── ...
└── build.js              # Simple Node script to assemble

Output: index.html (versioned and built)
```

**Cloudflare Pages integration**
- Build command: `node build.js` (or similar)
- Output directory: `/dist`
- Environment variable: `FORMAT_VERSION` from git tags
- Auto-deploy on version tag push

**Why defer this?**
- MVP doesn't need build complexity
- Single HTML file is easier to audit and understand
- Can manually update version string for v0.x releases
- Introduce build system when format stabilizes (v1.0+)

**When to implement**
- After 3+ manual version updates become painful
- When we need to maintain multiple format versions simultaneously
- If community contributions require easier content editing
- When format reaches v1.0 and stability matters more
