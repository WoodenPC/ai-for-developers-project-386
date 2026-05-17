# AGENTS.md

## Frontend Workspace

This workspace contains the client application for the calls calendar.

## Working Rules

- Treat `api-dto` as the contract source for backend communication.
- Do not hardcode backend API shapes when the change belongs in `api-dto`.
- Do not select a frontend framework, router, styling system, or state library until that decision is explicitly made.
- Keep UI code, client-side state, and frontend tests inside this workspace.
- Do not add dependencies until package choices are explicitly approved.
