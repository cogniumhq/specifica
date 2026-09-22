# Security Policy

This policy covers the open-source Specifica packages published by Cognium
Labs Inc: `@specifica/format` and `@specifica/store`.

The [specifica.org](https://specifica.org) site lives in
[cogniumhq/specifica-web](https://github.com/cogniumhq/specifica-web) and the
[specifica.app](https://specifica.app) editor in
[cogniumhq/specifica-app](https://github.com/cogniumhq/specifica-app);
vulnerabilities in either should be reported the same way, to the address
below.

## Supported versions

Security fixes are developed on `main` and published for affected artifacts:

| Artifact | Security fix policy |
|---|---|
| Current published version of each `@specifica/*` package | Publish a corrected version if that package is affected |
| Older package versions | No backports |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security problems.**

Report privately to Cognium Labs at **security@cognium.net**. If you want
end-to-end encryption, request our PGP key at that address before sending
vulnerability details.

Include, as much as you can:

- Affected package and exact version
- Reproduction steps or a proof-of-concept
- Impact assessment (data exposure, RCE, DoS, supply-chain, etc.)
- Your name / handle if you'd like credit in the advisory

## What to expect

- **Acknowledgement** within 3 working days.
- **An initial assessment** within 10 working days of the acknowledgement,
  saying whether we consider it a vulnerability and the rough severity.
- **A fix or a plan** for confirmed issues, with the timeline depending on
  severity. If we need longer we will tell you why.
- **Credit** in the advisory if you want it.

## Scope

In scope: the parsing and serialization logic in `@specifica/format`, the type
contracts in `@specifica/store`, and the published npm artifacts themselves
(including their dependency tree and publish provenance).

Out of scope: vulnerabilities that require a malicious maintainer, issues in
software that merely *uses* the format, and reports that amount to a
specification disagreement rather than a defect. `@specifica/format` parses
untrusted markdown, so parser crashes, pathological input, and anything that
escapes the `.specifica/` directory boundary are all in scope and worth
reporting.
