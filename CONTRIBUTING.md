# Contributing to Specifica

Thanks for your interest. Specifica is an open specification format built by
[Cognium Labs Inc](https://cognium.net), and contributions are welcome.

## Before you start

Open an issue before starting non-trivial work. That is especially true here
because a change to the **format** is different in kind from a change to the
**packages**: the format is a public contract that other tools implement, so
adding or renaming a field affects people who are not in this repository.

For small fixes — a typo, a failing edge case, a clarifying test — just open a
pull request.

## Where things live

This repository is one of three. Please open your change against the right one:

| Repo | Contents |
|---|---|
| **specifica** (this repo) | the `.specifica/` format specification, `@specifica/format`, `@specifica/store` |
| [specifica-web](https://github.com/cogniumhq/specifica-web) | the [specifica.org](https://specifica.org) site |
| [specifica-app](https://github.com/cogniumhq/specifica-app) | the [specifica.app](https://specifica.app) editor |

A PR that edits the website will be closed with a pointer to `specifica-web` —
not because it is unwelcome, but because it cannot deploy from here.

## Scope of contributions

Especially welcome:

- Bug fixes in `@specifica/format` parsing or serialization, with a test that
  fails before the fix.
- Round-trip cases the parser gets wrong (`parse` → `serialize` → `parse`).
- Clarifications to `.specifica/` where the specification is ambiguous.

Please discuss first:

- New fields or new files in the format. The three-file shape (`spec.md`,
  `design.md`, `tasks.md`) is deliberate, and "all files optional" is a
  guarantee other tools rely on.
- Runtime dependencies in `@specifica/format`. It is ~200 lines and
  dependency-free on purpose; anything added there ships to every consumer.
- Implementations in `@specifica/store`. It is types and interfaces only;
  storage backends belong in the tool that uses them.

## Contribution licensing

This project is MIT-licensed. By submitting a pull request you agree that your
contribution is licensed under the same terms. There is no separate CLA form.

## Development workflow

```bash
npm install        # npm workspaces
npm run build      # build both packages
npm test           # vitest
npm run clean      # remove build artifacts
```

`.specifica/` in this repo is the format's own specification, written in the
format. If your change alters the convention, update it there too — it is the
worked example people read.

## Pull requests

- Keep the PR focused. One concern per PR reviews faster and reverts cleanly.
- Add or update tests for behaviour changes, or say why none are needed.
- Say how you verified it. "Tests pass" is less useful than the command you
  ran and what it printed.
- Do not bump package versions in a PR. Releases are cut separately.

## Releases

Both packages are published to npm manually — there are no release workflows
in this repository. A version bump is therefore a deliberate act by a
maintainer, not a side effect of merging.

The format and the packages are versioned independently. The format is at v0.1
draft; expect it to change, and expect changes to be discussed in the open.

## Commit messages

Conventional commits (`fix:`, `feat:`, `docs:`, `chore:`). Explain *why* in the
body when the reason is not obvious from the diff.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Report
unacceptable behaviour to **conduct@cognium.net**.

## Security

Do not report vulnerabilities in public issues. See [SECURITY.md](SECURITY.md)
— report privately to **security@cognium.net**.

## Questions

Open an issue, or email [hello@cognium.net](mailto:hello@cognium.net).
