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
- Write component styles with CSS Modules. Keep `*.module.css` files next to the component or route that owns the markup.
- Use global CSS only for reset, base document styles, and third-party stylesheet imports. Shared CSS Modules are allowed only for repeated frontend UI primitives that are not owned by a single component.
- Keep TanStack Query keys centralized in a frontend API query key module; do not declare query key arrays inline in components or routes.
- Do not duplicate API DTO types in this workspace; import generated API types from `@calls-calendar/api-dto/generated`.
- Use the backend Prism mock API for frontend development when the real backend is unavailable.
- Do not select a state library until that decision is explicitly made.
- Keep UI code, client-side state, and frontend tests inside this workspace.
- Do not add dependencies until package choices are explicitly approved.
- Keep e2e selectors in page objects and prefer stable, intention-revealing locators.
- All CTA elements must have a stable `data-testid`.
- Use `getByRole` and `getByLabel` for user-facing controls only when the accessible name is intentionally stable.
- Use `data-testid` with semantic `aria-*` and `data-*` attributes for dynamic, repeated, formatted, localized, status-dependent, or CTA elements.
- Do not use XPath or regex over formatted UI text for e2e selectors.
- Keep `data-testid` values kebab-case and domain-specific.
