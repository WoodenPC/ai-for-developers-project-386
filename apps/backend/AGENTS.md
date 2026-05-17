# AGENTS.md

## Backend Workspace

This workspace contains the server application for the calls calendar.

## Working Rules

- Public API behavior must match the contract owned by `api-dto`.
- Do not expose new request or response shapes without updating `api-dto` first.
- Do not select a backend framework, database, ORM, queue, or auth stack until that decision is explicitly made.
- Keep server code, domain logic, persistence, and backend tests inside this workspace.
- Do not add dependencies until package choices are explicitly approved.
