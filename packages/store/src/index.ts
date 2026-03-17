/**
 * @specifica/store - Storage adapter interface for Specifica
 *
 * Defines the contract for any Specifica-compatible storage backend.
 * Implementation-agnostic - no infrastructure dependencies.
 */

import type { Task } from '@specifica/format'

// ─── Core Types ──────────────────────────────────────────────────────────────

/**
 * Stored item representing a feature, task, or routine
 */
export interface StoredItem {
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

/**
 * Memory item with provenance tracking
 */
export interface MemoryItem {
  id: string
  category: 'people' | 'preferences' | 'location' | 'work' | 'general'
  key: string
  value: string
  sourceItemId?: string                  // Which item this memory came from
  createdAt: number
}

/**
 * Chat message scoped to an item or global
 */
export interface Message {
  id: string
  itemId: string                         // 'global' for top-bar chat
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

/**
 * Git configuration for syncing to repository
 */
export interface GitConfig {
  token: string
  repo: string                           // 'owner/repo' format
  rootDir: string                        // '.specifica/', '.clove/', etc.
  branch?: string                        // defaults to repo default branch
}

/**
 * User settings and preferences
 */
export interface UserSettings {
  userId: string
  defaultRootDir?: string                // Default root directory for new projects
  theme?: 'light' | 'dark' | 'system'
  editorPreferences?: {
    fontSize?: number
    tabSize?: number
    wordWrap?: boolean
  }
}

/**
 * Board state derived from items
 */
export interface BoardState {
  columns: {
    id: string
    title: string
    items: StoredItem[]
  }[]
  filters?: {
    type?: string
    status?: string
  }
}

/**
 * Item content files (spec, design, tasks)
 */
export interface ItemContent {
  spec?: string
  design?: string
  tasks?: string
}

/**
 * Filter options for listing items
 */
export interface ItemFilter {
  type?: 'task' | 'routine' | 'feature'
  status?: 'new' | 'decomposing' | 'in_progress' |
           'waiting_approval' | 'done' | 'archived'
  parentId?: string
}

// ─── Storage Adapter Interface ───────────────────────────────────────────────

/**
 * Storage adapter interface for Specifica
 *
 * All methods are async to support various backends:
 * - Cloudflare Durable Objects + SQLite
 * - Local filesystem
 * - PostgreSQL
 * - In-memory (testing)
 *
 * Implementations must not leak infrastructure details.
 */
export interface StorageAdapter {
  // ─── Items (generic — works for todos, features, routines) ───

  /**
   * Create a new item
   */
  createItem(title: string, type?: 'task' | 'routine' | 'feature'): Promise<StoredItem>

  /**
   * Update an existing item
   */
  updateItem(id: string, updates: Partial<StoredItem>): Promise<StoredItem>

  /**
   * Get a single item by ID
   */
  getItem(id: string): Promise<StoredItem | null>

  /**
   * List items with optional filtering
   */
  listItems(filter?: ItemFilter): Promise<StoredItem[]>

  /**
   * Archive an item (soft delete)
   */
  archiveItem(id: string): Promise<void>

  // ─── Content (spec/design/tasks per item) ───

  /**
   * Get all content files for an item
   */
  getContent(itemId: string): Promise<ItemContent>

  /**
   * Update a specific content file for an item
   */
  updateContent(
    itemId: string,
    file: 'spec' | 'design' | 'tasks',
    content: string
  ): Promise<void>

  // ─── Tasks (structured access to tasks.md) ───

  /**
   * Get parsed tasks from an item's tasks.md
   */
  getTasks(itemId: string): Promise<Task[]>

  /**
   * Update the done status of a specific task
   */
  updateTaskStatus(itemId: string, taskOrder: number, done: boolean): Promise<void>

  // ─── Memory (user/project context with provenance) ───

  /**
   * Add a memory item
   */
  addMemory(
    category: MemoryItem['category'],
    key: string,
    value: string,
    sourceItemId?: string
  ): Promise<void>

  /**
   * Get all memory items
   */
  getMemory(): Promise<MemoryItem[]>

  /**
   * Delete a memory item
   */
  deleteMemory(id: string): Promise<void>

  /**
   * Serialize memory to principles.md format
   */
  getMemoryAsMarkdown(): Promise<string>

  // ─── Chat (scoped per item, never synced to git) ───

  /**
   * Add a chat message
   */
  addMessage(
    itemId: string | 'global',
    role: 'user' | 'assistant',
    content: string
  ): Promise<void>

  /**
   * Get chat messages for an item or global chat
   */
  getMessages(itemId: string | 'global', limit?: number): Promise<Message[]>

  // ─── Settings ───

  /**
   * Get user settings
   */
  getSettings(): Promise<UserSettings>

  /**
   * Update user settings
   */
  updateSettings(updates: Partial<UserSettings>): Promise<void>

  // ─── Board state (derived from items) ───

  /**
   * Get board state with columns derived from items
   */
  getBoardState(): Promise<BoardState>

  // ─── Git sync ───

  /**
   * Configure Git sync settings
   */
  configureGit(config: GitConfig): Promise<void>

  /**
   * Sync a single item to Git
   */
  syncToGit(itemId: string): Promise<void>

  /**
   * Sync all items to Git
   */
  syncAllToGit(): Promise<void>
}

// ─── Re-exports from @specifica/format ──────────────────────────────────────

export type { Task } from '@specifica/format'
