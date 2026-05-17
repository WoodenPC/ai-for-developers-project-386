# AGENTS.md

## Repository Scope

This repository is a pnpm monorepo for the calls calendar project.

Workspaces:

- `apps/frontend`: client application.
- `apps/backend`: server application.
- `packages/api-dto`: API contract and shared DTO boundary.

## Working Rules

- Do not edit, delete, or rename `.github/workflows/hexlet-check.yml`.
- Do not choose frontend or backend frameworks until that decision is explicitly made.
- Keep API design first: frontend and backend changes that affect their contract must go through `packages/api-dto`.
- Keep workspace ownership clear. Do not mix frontend implementation into backend or backend implementation into frontend.
- Avoid adding dependencies until package choices are explicitly approved.
