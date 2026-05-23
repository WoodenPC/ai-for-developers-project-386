# AGENTS.md

## Backend Workspace

This workspace contains the server application for the calls calendar.

## Working Rules

- Public API behavior must match the contract owned by `api-dto`.
- Do not expose new request or response shapes without updating `api-dto` first.
- Do not select a backend framework, database, ORM, queue, or auth stack until that decision is explicitly made.
- Use Prism as the backend API emulator for frontend development and contract checks.
- Keep Prism mock fixtures inside this backend workspace, not in `api-dto`.
- Keep server code, domain logic, persistence, and backend tests inside this workspace.
- Do not add dependencies until package choices are explicitly approved.
- Fastify is the selected backend framework for the real server implementation.
- Use Fastify plugins and decorators for backend dependency injection and app-level service/repository wiring.
- Use Vitest for backend unit testing and for mocking in tests.
- Service-layer business rules should be testable directly without starting a Fastify app.
- Runtime request/response validation should come from TypeSpec-generated OpenAPI schemas, not hand-written backend JSON Schema files.
