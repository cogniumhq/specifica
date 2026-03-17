# Principles

1. **Repo is the source of truth.** Every item is markdown files in a directory. No database owns the content — Git does. Clone the repo and you have everything.

2. **Three files, all optional.** Spec (what), design (how), tasks (work). A grocery list only needs `tasks.md`. A software feature needs all three. The format adapts to the item.

3. **Standard markdown, zero config.** GitHub-Flavored Markdown. No custom syntax, no preprocessor, no build step. One directory structure, one naming convention.

4. **Chat is scaffolding, files are the building.** Conversation produces and refines the three files. Chat is working process. Files are the permanent record that syncs to Git.

5. **Tool-agnostic format, shared packages.** The format works with any editor. `@specifica/format` is the open-source parser. `@specifica/store` is the open-source storage interface. Anyone can implement the interface — Cognium's Cloudflare engine is one implementation.
