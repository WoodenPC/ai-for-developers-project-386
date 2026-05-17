# AGENTS.md

## API DTO Workspace

This workspace owns the API contract between frontend and backend.

## Working Rules

- Treat this workspace as the boundary for API design first work.
- Do not choose OpenAPI, TypeScript DTOs, code generation, or validation tooling until that decision is explicitly made.
- Contract changes should be reviewed from both frontend and backend perspectives.
- Keep generated artifacts out of this workspace until generation strategy is chosen.
- Do not add dependencies until package choices are explicitly approved.
