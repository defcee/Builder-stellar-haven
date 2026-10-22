# BizzLeap SME

Digital marketplace and business storefront platform. This repository currently contains the foundation: the React web client, the Express API skeleton, the PostgreSQL schema, and the migration runner. Marketplace, dashboards, messaging, reviews, and administration are not built yet.

## Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS 3, React Router, TanStack Query
- Backend: Node.js 20+, Express 5, TypeScript, Zod, Helmet, CORS
- Database: PostgreSQL (Neon in production), plain SQL migrations with `pg`

## Local setup

1. Install dependencies: `npm install`
2. Copy the environment template: `cp .env.example .env`
3. Set `DATABASE_URL` in `.env` to your Neon connection string (include `sslmode=require`).
4. Apply migrations: `npm run db:migrate`
5. Start both servers: `npm run dev`
   - Web: http://localhost:5173 (proxies `/api` to the API)
   - API: http://localhost:8787

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Vite web client and the API with reload |
| `npm run build` | Compile the API to `dist/server` and build the web client to `dist` |
| `npm start` | Run the compiled API (`dist/server/index.js`) |
| `npm run typecheck` | Type-check the web client and the API |
| `npm run db:migrate` | Apply pending SQL files in `migrations/` |
| `npm test` | Run Vitest test suites |

## Environment variables

Backend (server only):

- `NODE_ENV`: `development`, `test`, or `production`
- `PORT`: API port (default `8787`; hosting platforms usually inject this)
- `FRONTEND_URL`: comma-separated list of allowed browser origins for CORS
- `DATABASE_URL`: PostgreSQL connection string

Frontend (exposed to the browser, must not contain secrets):

- `VITE_API_BASE_URL`: empty in development (uses the Vite proxy). When the web client is hosted separately, set it to the API origin plus `/api/v1`.

## Health endpoints

- `GET /api/v1/health`: confirms the process is running.
- `GET /api/v1/health/ready`: runs `SELECT 1` against the database and returns 503 without details when it fails.

## Database migrations

Migrations live in `migrations/` and run in filename order. Each file runs in a transaction and is recorded in `schema_migrations`. Applied migrations are never edited; add a new numbered file for every schema change.

- `0001_initial_schema.sql` creates users, sessions, verification and reset tokens, farmer and business profiles, categories, listings and images, conversations and messages, saved items, reviews, notifications, reports, contact messages, audit logs, and platform settings.

## Not yet implemented

- Authentication endpoints, email verification, and password reset
- Marketplace, storefront, and listing APIs and pages
- Image upload to object storage
- Dashboards, messaging, reviews, notifications, and administration
- Seed data and initial administrator provisioning
- Automated tests and deployment configuration for Render and cPanel
