# @specifica/store

Storage adapter interface for [Specifica](https://specifica.org) - implementation-agnostic types and contracts.

## Installation

```bash
npm install @specifica/store
```

## Overview

This package defines the `StorageAdapter` interface that any Specifica-compatible storage backend must implement. It includes all TypeScript types and method signatures, with no infrastructure dependencies.

**This is an interface package** - it contains types only, not implementations.

## Possible Implementations

- **Cloudflare Durable Objects + SQLite** (Cognium's proprietary implementation)
- **Local filesystem** (CLI tools)
- **PostgreSQL** (self-hosted)
- **In-memory** (testing)
- **better-sqlite3** (Electron/desktop apps)

## Usage

```typescript
import type { StorageAdapter, StoredItem, MemoryItem } from '@specifica/store'

// Implement the interface
class MyStorageAdapter implements StorageAdapter {
  async createItem(title: string, type = 'task') {
    // Your implementation here
  }

  async getItem(id: string) {
    // Your implementation here
  }

  // ... implement all methods
}
```

## Interface

The `StorageAdapter` interface provides:

### Items
- `createItem(title, type?)` - Create new item
- `updateItem(id, updates)` - Update existing item
- `getItem(id)` - Get single item
- `listItems(filter?)` - List items with filtering
- `archiveItem(id)` - Archive item (soft delete)

### Content
- `getContent(itemId)` - Get spec/design/tasks files
- `updateContent(itemId, file, content)` - Update specific file

### Tasks
- `getTasks(itemId)` - Get parsed tasks from tasks.md
- `updateTaskStatus(itemId, taskOrder, done)` - Toggle task checkbox

### Memory
- `addMemory(category, key, value, sourceItemId?)` - Add memory
- `getMemory()` - Get all memory items
- `deleteMemory(id)` - Delete memory
- `getMemoryAsMarkdown()` - Serialize to principles.md format

### Chat
- `addMessage(itemId, role, content)` - Add chat message
- `getMessages(itemId, limit?)` - Get chat history

### Settings
- `getSettings()` - Get user settings
- `updateSettings(updates)` - Update settings

### Board State
- `getBoardState()` - Get board state with columns

### Git Sync
- `configureGit(config)` - Configure Git settings
- `syncToGit(itemId)` - Sync single item
- `syncAllToGit()` - Sync all items

## Types

```typescript
interface StoredItem {
  id: string
  title: string
  slug: string
  type: 'task' | 'routine' | 'feature'
  status: 'new' | 'decomposing' | 'in_progress' |
          'waiting_approval' | 'done' | 'archived'
  parentId?: string
  createdAt: number
  updatedAt: number
}

interface MemoryItem {
  id: string
  category: 'people' | 'preferences' | 'location' | 'work' | 'general'
  key: string
  value: string
  sourceItemId?: string
  createdAt: number
}

interface Message {
  id: string
  itemId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

interface GitConfig {
  token: string
  repo: string
  rootDir: string
  branch?: string
}
```

See the [full type definitions](./src/index.ts) for all exported types.

## Design Principles

1. **No infrastructure leakage** - No Cloudflare, SQLite, or HTTP transport types
2. **All methods async** - Works with any backend (network, filesystem, database)
3. **Generic items** - Single interface for features, tasks, and routines
4. **Chat is ephemeral** - Stored but never synced to Git
5. **Memory has provenance** - Track which item a memory came from

## Related Packages

- [`@specifica/format`](../format) - Parser and serializer for Specifica markdown format

## License

MIT
