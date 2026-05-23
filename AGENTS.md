# AGENTS.md

## Repository Scope

This repository is a pnpm monorepo for the calls calendar project.

## Package Manager
We use **pnpm** for package management and workspace orchestration.

Workspaces:

- `apps/frontend`: client frontend application.
- `apps/backend`: server backend application.
- `packages/api-dto`: API contract and shared DTO boundary.

## Working Rules

- Do not edit, delete, or rename `.github/workflows/hexlet-check.yml`.
- Do not choose frontend or backend frameworks until that decision is explicitly made.
- Keep API design first: frontend and backend changes that affect their contract must go through `packages/api-dto`.
- Keep workspace ownership clear. Do not mix frontend implementation into backend or backend implementation into frontend.
- Avoid adding dependencies until package choices are explicitly approved.
- Prefer `kebab-case` for source file names unless a framework, generator, or external tool requires another naming convention.
