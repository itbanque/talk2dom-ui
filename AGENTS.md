# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router routes and API handlers (see `api/*`) plus page-level layouts. Each feature lives in its own route folder (e.g., `projects`, `playground`).
- `src/components`: Shared UI. `layout/` holds navigation and shell components; `ui/` contains reusable widgets.
- `src/context`: React providers and client-side state.
- `src/lib`: Helpers (auth, data, utilities) consumed across routes.
- `prisma`: Database schema (`schema.prisma`) and migrations; `dev.db` is the local SQLite store. Keep migrations in this folder.
- `public`: Static assets (images, video demos); served as `/`.
- Path alias: `@/` maps to `src/` (see `tsconfig.json`).

## Build, Test, and Development Commands
- `npm run dev`: Start the local dev server on port 3000 with hot reload.
- `npm run build`: Production build; runs type checks and prepares `.next`.
- `npm run start`: Serve the built app; use to verify production output.
- `npm run lint`: ESLint using `next/core-web-vitals` and TypeScript rules.
- `npx prisma migrate dev --name <change>`: Apply/update local DB schema and regenerate the Prisma client.

## Coding Style & Naming Conventions
- TypeScript + React function components; App Router patterns (`layout.tsx`, `page.tsx`, `route.ts` for handlers).
- Indentation is 2 spaces; favor early returns and small pure helpers in `src/lib`.
- Client components declare `"use client"` at the top; prefer server components otherwise.
- Use Tailwind utility classes; keep custom styles in `src/app/globals.css` when needed.
- Imports should favor the `@/` alias for local code and keep relative depth shallow.

## Testing Guidelines
- No dedicated test suite is present; at minimum run `npm run lint` before pushing.
- When adding tests, colocate them with the feature (`*.test.tsx` or `__tests__`), and cover critical flows (auth, billing, API routes). Choose the runner best suited to the change (e.g., Playwright for E2E, Vitest/Jest for units) and document commands in the PR.

## Commit & Pull Request Guidelines
- Commits: present-tense, imperative summaries (`Add billing usage chart`). Group logical changes; avoid unrelated churn.
- PRs: include a short description, steps to reproduce/verify, and screenshots or screen recordings for UI changes. Link the relevant issue or ticket.
- Run `npm run lint` (and `npm run build` for risky changes) before requesting review. Note any failing checks with rationale.

## Security & Configuration Tips
- Keep secrets in `.env` (not tracked). Database URLs, Auth providers, and Stripe keys belong there.
- Update `prisma/schema.prisma` with care; regenerate the client and include migrations in the PR.
- Sanitize any user-generated content rendered in Markdown/HTML; favor existing utility helpers for parsing or escaping when available.
