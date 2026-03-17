# Specifica — Design

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Cognium Products                          │
│                                                             │
│   specifica.app          Clove (Bombastic)     Future apps  │
│   ┌─────────────┐       ┌─────────────┐                    │
│   │ Next.js 15   │       │ Board UI     │                   │
│   │ Claude API   │       │ Cortex proxy │                   │
│   └──────┬──────┘       └──────┬──────┘                    │
│          │                     │                            │
│          └──────────┬──────────┘                            │
│                     ▼                                       │
│          ┌─────────────────────┐                            │
│          │ @specifica/store    │ ← Interface (open source)  │
│          │ (StorageAdapter)    │                             │
│          └──────────┬──────────┘                            │
│                     │ implements                            │
│          ┌──────────┴──────────┐                            │
│          │ Cognium DO Engine   │ ← Internal (CF DO+SQLite)  │
│          └──────────┬──────────┘                            │
│                     │                                       │
│          ┌──────────┴──────────┐                            │
│          │ @specifica/format   │ ← Parser (open source)     │
│          └──────────┬──────────┘                            │
│                     │                                       │
│                     ▼                                       │
│              ┌──────────────┐                               │
│              │  GitHub API   │ ← Git sync                   │
│              └──────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

## Two-Layer Storage

| Layer | Tech | Purpose |
|-------|------|---------|
| Working | SQLite in Cloudflare DO | Fast reads/writes for live app. Board state, chat, settings. |
| Persistence | Git repo via GitHub API | Portable, version-controlled, user-owned. Content files only. |

Chat stays in SQLite. Content files sync to Git. Chat is scaffolding — files are the building.

---

## Package 1: `@specifica/format`

Pure TypeScript. No infrastructure dependencies. Open source, npm published.

### API

```typescript
parse(specMd?: string, designMd?: string, tasksMd?: string): Item
serialize(item: Item): { spec?: string, design?: string, tasks?: string }
validate(files: Record<string, string>): ValidationResult
parseTasks(tasksMd: string): Task[]
serializeTasks(tasks: Task[]): string
```

### Types

```typescript
interface Item {
  slug: string                        // kebab-case directory name
  spec?: string                       // raw markdown
  design?: string                     // raw markdown
  tasks?: Task[]                      // parsed checkboxes
  metadata?: Record<string, string>   // optional frontmatter
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

### Key Decisions

1. **spec.md and design.md are raw strings.** The parser doesn't parse internal structure (headings, sections). Internal structure is convention, not schema.
2. **tasks.md is structured.** Checkboxes have machine-readable state — the one file with real parsing.
3. **All files optional.** Apps decide what to generate. The format doesn't enforce completeness.
4. **~200 lines.** Keep it small. One file, no dependencies.

---

## Package 2: `@specifica/store` (Interface)

Open source. Published to npm. Defines the storage adapter contract. No infrastructure dependencies — pure TypeScript interfaces and types.

### StorageAdapter Interface

```typescript
interface StorageAdapter {
  // ─── Items (generic — works for todos, features, routines) ───
  createItem(title: string, type?: string): Promise<Item>
  updateItem(id: string, updates: Partial<Item>): Promise<Item>
  getItem(id: string): Promise<Item | null>
  listItems(filter?: { type?: string, status?: string }): Promise<Item[]>
  archiveItem(id: string): Promise<void>

  // ─── Content (spec/design/tasks per item) ───
  getContent(itemId: string): Promise<{ spec?: string, design?: string, tasks?: string }>
  updateContent(itemId: string, file: 'spec' | 'design' | 'tasks', content: string): Promise<void>

  // ─── Tasks (structured access to tasks.md) ───
  getTasks(itemId: string): Promise<Task[]>
  updateTaskStatus(itemId: string, taskOrder: number, done: boolean): Promise<void>

  // ─── Memory (user/project context with provenance) ───
  addMemory(category: string, key: string, value: string, sourceItemId?: string): Promise<void>
  getMemory(): Promise<MemoryItem[]>
  deleteMemory(id: string): Promise<void>
  getMemoryAsMarkdown(): Promise<string>     // Serializes to principles.md format

  // ─── Chat (scoped per item, never synced to git) ───
  addMessage(itemId: string | 'global', role: string, content: string): Promise<void>
  getMessages(itemId: string | 'global', limit?: number): Promise<Message[]>

  // ─── Settings ───
  getSettings(): Promise<UserSettings>
  updateSettings(updates: Partial<UserSettings>): Promise<void>

  // ─── Board state (derived from items) ───
  getBoardState(): Promise<BoardState>

  // ─── Git sync ───
  configureGit(config: GitConfig): Promise<void>
  syncToGit(itemId: string): Promise<void>
  syncAllToGit(): Promise<void>
}
```

### Types

```typescript
interface StoredItem {
  id: string
  title: string
  slug: string                           // kebab-case, auto-generated
  type: 'task' | 'routine' | 'feature'
  status: 'new' | 'decomposing' | 'in_progress' |
          'waiting_approval' | 'done' | 'archived'
  parentId?: string
  createdAt: number
  updatedAt: number
}

interface MemoryItem {
  id: string
  category: string                       // 'people', 'preferences', 'location', 'work', 'general'
  key: string
  value: string
  sourceItemId?: string
  createdAt: number
}

interface Message {
  id: string
  itemId: string                         // 'global' for top-bar chat
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

interface GitConfig {
  token: string
  repo: string                           // 'owner/repo'
  rootDir: string                        // '.specifica/', '.clove/', etc.
}
```

### Key Decisions

1. **All methods are async.** Works for SQLite, filesystem, network — any backend.
2. **No infrastructure leakage.** No Cloudflare types, no SQLite references, no HTTP transport in the interface.
3. **Git sync is part of the contract.** Implementations decide how — GitHub API, local git CLI, or no-op.
4. **Chat is in the interface but never synced.** Implementations must store chat but must not include it in git sync.

Possible implementations: Cloudflare DO + SQLite (Cognium), filesystem (CLI tools), SQLite via better-sqlite3 (Electron/desktop), PostgreSQL (self-hosted), in-memory (testing).

---

## Cognium Internal: Cloudflare DO Implementation

The proprietary runtime for specifica.app and Clove. Implements `StorageAdapter`.

### SQLite Schema

```sql
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'task',
  status TEXT NOT NULL DEFAULT 'new',
  parent_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE content (
  item_id TEXT NOT NULL,
  file TEXT NOT NULL,                    -- 'spec', 'design', 'tasks'
  body TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (item_id, file)
);

CREATE TABLE memory (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  source_item_id TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE git_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

### Git Sync Behavior

- Syncs content files (spec.md, design.md, tasks.md) to GitHub repo
- Never syncs chat history, settings, or git config
- Memory syncs as `principles.md` at the configured root directory
- Root directory configurable: `.specifica/` for software, `.clove/` for personal
- Uses GitHub REST API (`PUT /repos/:owner/:repo/contents/:path`)
- Triggers on meaningful state changes (not every keystroke). Debounced.
- MVP is unidirectional: SQLite → Git. Bidirectional (git → SQLite via webhook) is v2.

### Implementation Decisions

1. **SQLite in DO, not D1.** Each user gets their own DO with embedded SQLite. Fast, isolated, no shared database bottleneck.
2. **Generic items, not typed tables.** One `items` table with a `type` column — works for features, todos, routines. Apps add domain logic on top.
3. **Chat never leaves the DO.** Chat is working process. Files are refined output.
4. **~400 lines.** Base class + migrations + sync logic.

---

## specifica.app Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js 15 (App Router) | RSC, starter template |
| UI | shadcn/ui + Tailwind | Ship fast, looks good |
| Storage | Cognium DO (implements `@specifica/store`) | Shared interface with Clove |
| Format | `@specifica/format` | Shared parser |
| Auth | Cloudflare KV | GitHub tokens (encrypted, 8h TTL) |
| LLM | Claude API (direct) | No Cortex needed — reasoning only |
| Editor | CodeMirror 6 | Markdown editing + syntax highlight |
| Git | Octokit | GitHub REST API |

### Auth Flow

```
Browser → GET /auth/github → 302 to github.com/authorize (scope: repo)
GitHub  → 302 to /auth/callback?code=xxx
Worker  → exchange code for token → encrypt → store in KV → upsert user
Worker  → set HTTP-only session cookie → 302 to /dashboard
```

### Chat / LLM Flow

System prompt:
```
You are a spec editor. Return the COMPLETE updated file, not a diff.
Preserve existing structure. Only change what the user asks for.
Follow Specifica format conventions. Don't explain changes unless asked.
```

Request shape:
```
messages: [
  system: SYSTEM_PROMPT,
  user: "Current file ({path}):\n```markdown\n{content}\n```",
  ...chatHistory (last 20 msgs, 4000 token budget),
  user: userMessage
]
model: claude-sonnet-4-20250514
stream: true
```

### Commit Flow (GitHub Trees API)

Atomic multi-file commit in 5 steps:

1. `GET /git/ref/heads/{branch}` → current commit SHA
2. `GET /git/commits/{sha}` → current tree SHA
3. `POST /git/trees` with base_tree + changed files → new tree SHA
4. `POST /git/commits` with new tree + parent → new commit SHA
5. `PATCH /git/refs/heads/{branch}` → branch updated

If step 5 fails (fast-forward conflict), nothing is partially committed.

---

## Product Mapping

### How specifica.app uses the packages

```
@specifica/format   — serializes feature specs to/from markdown
@specifica/store    — StorageAdapter interface for all state management
+ Cognium DO Engine — implements StorageAdapter (Cloudflare DO + SQLite)
+ Direct LLM call   — Claude API, no Cortex
+ Feature logic     — spec/design/tasks, PR creation
+ Three-pane UI     — sidebar, content, chat
```

### How Clove uses the same packages

```
@specifica/format   — serializes todo content to/from markdown
@specifica/store    — StorageAdapter interface for all state management
+ Cognium DO Engine — same implementation, different root dir (.clove/)
+ Cortex proxy      — skill discovery, execution, approval flow
+ Todo domain logic — task vs routine, lifecycle rules
+ Board UI          — consumer-facing app
```

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `repo` scope is broad | Users hesitate to auth | Document clearly; consider `public_repo` toggle |
| LLM rewrites unasked sections | User frustration | System prompt + diff view |
| GitHub API rate limit (5000/hr) | Blocks usage | Fetch tree once per page load |
| Pending changes lost on refresh | Data loss | Acceptable for MVP; DO persistence later |
| Package interface changes | Breaks both products | Version packages, coordinate releases |
| Unidirectional sync causes drift | Git and DO diverge | Clear "Git is archive" mental model for MVP |

## Key Decisions

1. **Two layers.** SQLite is the working layer. Git is the persistence layer. No single source of truth problem — they serve different purposes.
2. **Interface vs implementation.** `@specifica/store` is the open interface. Cognium's DO engine is one implementation. Anyone can build another — filesystem, PostgreSQL, in-memory.
3. **Single branch only.** All reads/commits target default branch.
4. **No WebSockets.** Chat streams via SSE.
5. **Whole-file LLM output.** Simpler than diffs, more tokens but reliable.
6. **Chat scoped to one file.** Cross-file chat is v2.
7. **Board pattern.** Both products use a board + scoped chat UI. Different domain logic, same layout.
