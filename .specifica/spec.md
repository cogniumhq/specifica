# Specifica [v1.0-rc]

## What

Specifica is a structured content format for Git and the shared platform that powers it. Three markdown files per item — spec.md (what), design.md (how), tasks.md (work) — in a configurable root directory. All files optional. Works for software specs, team workflows, and personal planning.

The project has three layers: an open format specification (specifica.org), two shared packages (`@specifica/format` and `@specifica/store`), and a web editor (specifica.app). Multiple Cognium products build on the same format and packages.

## Success Criteria

- `@specifica/format`: parse tasks.md → Task[], serialize back, validate directory structure. Published to npm. ~200 lines.
- `@specifica/store`: `StorageAdapter` interface with types for items, content, memory, chat, git sync. Published to npm. Implementation-agnostic.
- specifica.app: Sign in → connect repo → write specs via chat → commit to GitHub in under 20 minutes.
- specifica.org: Format reference site live at specifica.pages.dev.

## Appetite

Phase 0 (packages): 3 days
Phase 1–5 (app): 10 days

## Non-Goals

Realtime collaboration, branching/PRs, mobile optimization, offline support, bidirectional git sync (v2).

---

## R1: Format Specification

The open format — documented at specifica.org, parseable by `@specifica/format`.

- [ ] Root directory is configurable (`.specifica/`, `.clove/`, etc.)
- [ ] `principles.md` at root for project or user context/memory
- [ ] Item folders are kebab-case
- [ ] Three files per item: `spec.md`, `design.md`, `tasks.md` — all optional
- [ ] `spec.md` and `design.md` are raw markdown (convention, not schema)
- [ ] `tasks.md` is machine-readable: `- [ ]` / `- [x]` checkboxes parse to structured `Task[]`
- [ ] Extra files in the directory are preserved, never deleted
- [ ] Standard GFM — no custom syntax, no preprocessor

**Edge cases:** Item folder with no files → valid but empty. Non-markdown files in directory → ignored by parser. Nested folders inside item folder → not part of spec, preserved.

---

## R2: `@specifica/format` Package

Pure TypeScript library. No infrastructure dependencies. Open source, published to npm.

- [ ] `parse(spec?, design?, tasks?)` → `Item` object
- [ ] `serialize(item)` → `{ spec?, design?, tasks? }` markdown strings
- [ ] `parseTasks(tasksMd)` → `Task[]` with title, done, order
- [ ] `serializeTasks(tasks)` → markdown string
- [ ] `validate(files)` → `{ valid, errors[], warnings[] }`
- [ ] Handles optional files gracefully (not every item has all three)
- [ ] Directory name validation (kebab-case)
- [ ] Frontmatter support (optional YAML metadata in spec.md)

**Edge cases:** Malformed checkboxes → best-effort parse. Empty files → valid. tasks.md with non-checkbox content → preserve as-is.

---

## R3: `@specifica/store` Interface

Storage adapter interface. Open source, published to npm. Defines the contract for any Specifica-compatible storage backend. Depends on `@specifica/format` for types.

- [ ] `StorageAdapter` interface with method signatures for items, content, tasks, memory, chat, settings
- [ ] Item CRUD: create, update, get, list, archive (generic: features, todos, routines)
- [ ] Content access: get/update per item per file (spec/design/tasks as markdown)
- [ ] Structured task access: get tasks, update checkbox state
- [ ] Memory with provenance: category, key, value, source item
- [ ] Memory serialization to `principles.md` format
- [ ] Chat messages scoped per item + global
- [ ] Git sync contract: configure, sync item, sync all
- [ ] All types exported (`Item`, `MemoryItem`, `Message`, `UserSettings`, `BoardState`)
- [ ] No infrastructure dependencies — pure TypeScript types and interfaces

The interface must not leak implementation details (no Cloudflare DO lifecycle, no SQLite references, no specific sync transport). Anyone can implement it: filesystem, SQLite, PostgreSQL, in-memory.

**Cognium implements this internally** as a Cloudflare DO + SQLite engine with GitHub REST API sync. That implementation is not published — it's the proprietary runtime for specifica.app and Clove.

---

## R4: GitHub Auth

Users sign in with GitHub OAuth. No other auth method.

- [ ] "Sign in with GitHub" on landing page
- [ ] OAuth requests `repo` scope (needed for private repos)
- [ ] On callback: upsert user in D1, store encrypted token in KV (8h TTL)
- [ ] Redirect to `/dashboard` on success
- [ ] Expired token mid-session → show "Re-authenticate" prompt
- [ ] Sign-out clears KV token and session cookie

**Edge cases:** User revokes OAuth app → next API call fails → re-auth prompt. User has no repos → empty state.

---

## R5: Connect Repo + View

Users connect a GitHub repo and browse `.specifica/` contents.

- [ ] Dashboard shows "Connect Repo" with searchable repo list
- [ ] If `.specifica/` exists → read its contents
- [ ] If `.specifica/` doesn't exist → scaffold starter files via single commit
- [ ] Project page has sidebar file tree mirroring `.specifica/` structure
- [ ] Clicking a file renders its markdown
- [ ] Item folders are collapsible, showing spec.md / design.md / tasks.md
- [ ] "Add Feature" creates a new item folder
- [ ] URL updates to reflect selected file (deep-linkable)

**Edge cases:** User has 500+ repos → paginate + search. Unexpected structure → show as-is. Repo access revoked → "Repo inaccessible" state.

---

## R6: Edit + Chat Refine

Users edit specs inline or refine through chat. Chat is the primary flow.

- [ ] "Edit" toggles to CodeMirror 6 with markdown highlighting
- [ ] Split-pane: editor left, live preview right
- [ ] "Save" stages locally (does NOT commit)
- [ ] "Chat" opens chat panel alongside the current file
- [ ] Chat scoped to one file at a time
- [ ] LLM returns complete updated file (not a diff)
- [ ] Response streams via SSE
- [ ] Updated content shows as visual diff (green/red)
- [ ] "Accept" stages as pending change, "Reject" discards
- [ ] Chat history persists per file per session

**Edge cases:** LLM returns malformed markdown → accept as-is. LLM rewrites unasked sections → diff view catches it. Navigate with unsaved changes → prompt.

---

## R7: Commit

Users review pending changes and commit atomically to GitHub.

- [ ] "Commit" button shows badge with number of pending changes
- [ ] Review panel: changed files with diffs, checkboxes, editable commit message
- [ ] Auto-generated message: `docs: update {file1}, {file2}`
- [ ] Push via GitHub Trees API (atomic, single commit)
- [ ] SHA conflict detection: warn if file changed remotely
- [ ] On success: clear changes, show toast with GitHub commit link
- [ ] On failure: preserve all pending changes

**Edge cases:** No pending changes → button disabled. One file conflicts → commit non-conflicting, re-fetch conflicting. GitHub API failure → atomic rollback.
