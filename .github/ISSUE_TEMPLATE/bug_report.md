---
name: Bug report
about: A defect in @specifica/format or @specifica/store
labels: bug
---

## What happened

## What you expected

## Reproduction

The smallest input that shows it. For a parsing bug, the `.specifica/` content
matters more than the surrounding project:

```markdown
<!-- spec.md / design.md / tasks.md content -->
```

```typescript
// the parse/serialize call
```

## Environment

- Package and version:
- Node version:

## Notes

Round-trip bugs (`parse` → `serialize` → `parse` not returning the same thing)
are especially useful — please say which direction breaks.
