# Specifica — Tasks

## Phase 0: Packages + Site (Days 1–3)

### `@specifica/format`
- [ ] Create `packages/format/` with TypeScript config
- [ ] Implement `parseTasks(tasksMd)` → `Task[]` (checkbox parsing)
- [ ] Implement `serializeTasks(tasks)` → markdown string
- [ ] Implement `parse(spec?, design?, tasks?)` → `Item`
- [ ] Implement `serialize(item)` → `{ spec?, design?, tasks? }`
- [ ] Implement `validate(files)` → `{ valid, errors, warnings }`
- [ ] Kebab-case directory name validation
- [ ] Optional frontmatter support in spec.md
- [ ] Unit tests for parse/serialize roundtrip
- [ ] Publish to npm as `@specifica/format`

### `@specifica/store` interface
- [ ] Define `StorageAdapter` interface (all method signatures, async)
- [ ] Define all types (`StoredItem`, `MemoryItem`, `Message`, `GitConfig`, `UserSettings`, `BoardState`)
- [ ] Ensure no infrastructure leakage (no Cloudflare, no SQLite in interface)
- [ ] Publish to npm as `@specifica/store`
- [ ] Align interface with Bombastic team

### specifica.org
- [ ] Deploy specifica.org to Cloudflare Pages (`specifica.pages.dev`)
- [ ] Configure custom domain (specifica.org)

## Phase 1: Auth + Scaffold (Days 4–5)

- [ ] Create GitHub OAuth App (dev + prod)
- [ ] Implement `/auth/github` → redirect to GitHub with state param
- [ ] Implement `/auth/callback` → exchange code, encrypt token, store in KV
- [ ] Upsert user in D1, set HTTP-only session cookie
- [ ] Implement `/auth/logout` → clear KV + cookie
- [ ] Auth middleware for `/dashboard` and `/api/*` routes
- [ ] Handle expired token → re-auth redirect
- [ ] Landing page with "Sign in with GitHub" button

## Phase 2: Connect Repo + File Tree (Days 6–7)

- [ ] "Connect Repo" modal with searchable repo list (`GET /user/repos`)
- [ ] `POST /api/projects` → check for `.specifica/`, create project record
- [ ] Scaffold logic: create `.specifica/` template via GitHub Trees API if missing
- [ ] Dashboard: project list with repo name + last updated
- [ ] Project page: sidebar file tree from `GET /git/trees/{branch}?recursive=1`
- [ ] File tree component (collapsible folders, file icons, active highlight)
- [ ] Click file → fetch + render markdown (react-markdown + remark-gfm)
- [ ] URL routing per file (`/project/:id/:path`)
- [ ] "Add Feature" flow (name → slugify → create commit)
- [ ] Empty file placeholder with "Create this file" button

## Phase 3: Edit Inline (Days 8–9)

- [ ] Install CodeMirror 6 with markdown extension (dynamic import)
- [ ] Editor component: split-pane (CodeMirror left, preview right)
- [ ] Pending changes state: track original content, SHA, current content per file
- [ ] "Edit" toggle between view and editor mode
- [ ] "Save" stages locally, "Discard" reverts to original
- [ ] Unsaved changes dot in sidebar
- [ ] Navigation guard: prompt on unsaved changes
- [ ] New file templates (spec.md, design.md, tasks.md starters)
- [ ] `Cmd+S` keybinding

## Phase 4: Chat Refine (Days 10–12)

- [ ] System prompt for spec editing
- [ ] `POST /api/chat` → build context (system + file + history) → proxy SSE stream
- [ ] Chat panel UI (message list, input, send button)
- [ ] Streaming token-by-token display
- [ ] Diff view component (green/red via `diff` library)
- [ ] "Accept" → stage as pending change, "Reject" → discard
- [ ] Chat history persisted per file per session
- [ ] Load last 20 messages per file on open
- [ ] Typing/generating indicator
- [ ] Stream error handling with retry option

## Phase 5: Commit (Day 13)

- [ ] "Commit" button with pending changes badge
- [ ] Commit review panel: file list + checkboxes + diffs + message input
- [ ] Auto-generated commit message from file names
- [ ] `POST /api/projects/:id/commit` → GitHub Trees API 5-step atomic commit
- [ ] SHA conflict detection (stored vs remote blob SHA)
- [ ] Conflict warning UI (skip / force)
- [ ] Success toast with link to GitHub commit
- [ ] Error handling: preserve pending changes on failure
- [ ] Disable button when no pending changes

## Phase 6: Cognium DO Engine — `StorageAdapter` Implementation (parallel)

- [ ] Implement `StorageAdapter` as Cloudflare Durable Object class
- [ ] SQLite schema + migrations
- [ ] Implement item CRUD (create, update, get, list, archive)
- [ ] Implement content storage (get/update per item per file)
- [ ] Implement structured task access (parse/update checkbox state via `@specifica/format`)
- [ ] Implement memory with provenance (add, get, delete, serialize to markdown)
- [ ] Implement chat message storage (scoped per item + global)
- [ ] Implement settings storage
- [ ] Implement git sync: configure, sync single item, sync all (GitHub REST API)
- [ ] Git sync: debounce on meaningful state changes
- [ ] Git sync: configurable root directory
- [ ] Internal package (not published to npm)

## Estimate

| Phase | Days | Blocks |
|-------|------|--------|
| Packages + Site | 3 | Blocks Bombastic |
| Auth + Scaffold | 2 | — |
| Connect Repo + File Tree | 2 | — |
| Edit Inline | 2 | — |
| Chat Refine | 3 | — |
| Commit | 1 | — |
| Store Build | parallel | Co-owned, internal |
| **Total** | **13 + parallel** | |
