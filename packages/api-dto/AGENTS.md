# AGENTS.md

## API DTO Workspace

This workspace owns the API contract between frontend and backend.

## Working Rules

- Treat this workspace as the boundary for API design first work.
- Use TypeSpec as the authored contract source.
- Use `@typespec/openapi3` to emit OpenAPI.
- Use `openapi-typescript` to generate TypeScript DTO types from emitted OpenAPI.
- Do not store runtime mocks or Prism fixtures in this workspace.
- Contract changes should be reviewed from both frontend and backend perspectives.
- Keep TypeSpec business entity descriptions in `models`; keep API operation descriptions and their request/response DTOs in `operations`.
- Generated DTO artifacts belong in this workspace and must be regenerated from the OpenAPI output.
- Do not add dependencies until package choices are explicitly approved.
