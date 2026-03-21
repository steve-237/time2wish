# Skill: Angular Architecture

## Goal
Design a scalable and maintainable Angular application structure.

## Guidelines
- Separate concerns across `core`, `shared`, `features/pages`, and `models`.
- Use lazy loading / `loadComponent` for pages.
- Centralize HTTP calls inside domain services.
- Keep guards, interceptors, and authentication logic under `core`.
- Prefer standalone and decoupled components.

## Checklist
- [ ] One service per business domain.
- [ ] No heavy business logic inside templates.
- [ ] Explicit types/interfaces for all API responses.
