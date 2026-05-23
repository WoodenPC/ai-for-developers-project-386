# AGENTS.md

## Frontend Workspace

This workspace contains the client application for the calls calendar.

## Working Rules

- Treat `api-dto` as the contract source for backend communication.
- Do not hardcode backend API shapes when the change belongs in `api-dto`.
- Build frontend application code with TypeScript and React.
- Use Mantine as the UI kit.
- Use zod for frontend form schemas and validation, and react-hook-form for form state and submission.
- Use TanStack Router for routing.
- Routing must be file-based.
- Keep route files focused on routing and page composition; put business-domain React components, query/mutation orchestration, and domain UI logic under `src/components`, preferably grouped by feature.
- Prefer one React component per `.tsx` file; move helper components into separate files within the same feature folder, and keep non-component helpers in `.ts` files.
- Keep TanStack Query keys centralized in a frontend API query key module; do not declare query key arrays inline in components or routes.
- Do not duplicate API DTO types in this workspace; import generated API types from `@calls-calendar/api-dto/generated`.
- Use the backend Prism mock API for frontend development when the real backend is unavailable.
- Do not select a state library until that decision is explicitly made.
- Keep UI code, client-side state, and frontend tests inside this workspace.
- Do not add dependencies until package choices are explicitly approved.
