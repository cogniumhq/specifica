# Specifica Principles

These principles guide every decision in the Specifica format and reference documentation.

## 1. Repo is the source of truth

Every spec is a `.md` file in `.specifica/`. No external database, no SaaS platform, no proprietary format owns the content. Clone the repo and you have the specs.

## 2. Markdown is the format

Standard GitHub-Flavored Markdown. No custom syntax, no preprocessor, no build step. Readable on GitHub, in VS Code, in a terminal, on paper, in email.

## 3. Three files per feature

Spec (what it does), design (how it works), tasks (implementation order). Separate concerns, separate audiences. Mixing them is how specs become unreadable.

## 4. Opinionated structure

One directory layout. One naming convention. Constraints eliminate the decisions that don't matter — where to put files, what to call them, how to organize features.

## 5. Tool-agnostic

The format works with any text editor, any Git workflow, any CI pipeline. Tooling enhances Specifica — it doesn't own it. You can always fall back to `vim` and `git push`.

## 6. Format before tooling

The open format (specifica.org) must always be useful without any specific tool. The web app (specifica.app) is one implementation, not a requirement.

## 7. Simplicity over features

Inspired by Spec Kit but radically simplified. Anyone should be able to start using Specifica in under 5 minutes with just `mkdir` and a text editor.
