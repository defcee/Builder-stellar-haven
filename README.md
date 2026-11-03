# BizzLeap

BizzLeap is a local-products marketplace connecting farmers, small businesses, and buyers. The current release includes account registration and login, public listing search and details, and seller listing management, backed by PostgreSQL.

## Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS 3, React Router, TanStack Query
- Backend: Node.js 20+, Express 5, TypeScript, Zod, Helmet, CORS
- Database: PostgreSQL (Neon in production), plain SQL migrations with `pg`

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` (PowerShell: `Copy-Item .env.example .env`).
3. Set `DATABASE_URL` in `.env` to your PostgreSQL connection string. For Neon, use `sslmode=verify-full` for explicit certificate and hostname verification.
4. Verify the database connection: `npm run db:check`
5. Apply migrations: `npm run db:migrate`
6. Start both servers: `npm run dev`
   - Web: http://localhost:8080 (proxies `/api` to the API)
   - API: http://localhost:8787

The API loads `.env` at startup. The example frontend origin must match the browser origin in `FRONTEND_URL`. In production, set `NODE_ENV=production`, `DATABASE_URL`, and `FRONTEND_URL` explicitly; serve the frontend over HTTPS so session cookies are secure.

Listing images are sent to the backend and uploaded to Cloudinary using a server-side signature. Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` on the backend; the API secret must never be set in a `VITE_` variable. These three settings are required in production. The backend accepts valid JPEG, PNG, WebP, or AVIF images up to 5 MB.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Vite web client and the API with reload |
| `npm run build` | Compile the API to `dist/server` and build the web client to `dist` |
| `npm start` | Run the compiled API (`dist/server/index.js`) |
| `npm run typecheck` | Type-check the web client and the API |
| `npm run db:check` | Verify PostgreSQL connectivity and execute a test query |
| `npm run db:migrate` | Apply pending SQL files in `migrations/` |
| `npm test` | Run Vitest test suites |

## Environment variables

Backend (server only):

- `NODE_ENV`: `development`, `test`, or `production`
- `PORT`: API port (default `8787`; hosting platforms usually inject this)
- `FRONTEND_URL`: comma-separated list of allowed browser origins for CORS
- `DATABASE_URL`: PostgreSQL connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: backend-only Cloudinary credentials. All three are required in production; leave all unset to disable image uploads in development.

Frontend (exposed to the browser, must not contain secrets):

- `VITE_API_URL`: empty in development (uses the Vite proxy). When the web client is hosted separately, set it to the API origin plus `/api/v1`.

## Implemented flows

- Sign up as a farmer, small business, or buyer; sign in and sign out using database-backed HTTP-only sessions.
- Farmers and business owners can publish listings, set availability, and archive their listings from the dashboard.
- Farmers can list agricultural produce or livestock; small businesses can list artisan goods, small-business products, or other products, with a seller-entered category.
- Visitors can search and filter the public catalog, open listing details, and use seller contact details when provided.
- Sellers can edit their account and storefront profile; published business storefronts have public listing pages.
- Signed-in users can start listing-based conversations, message participants, and review listings (except their own). New messages and reviews create in-app notifications.
- Listing photos are uploaded to Cloudinary through a backend-validated 5 MB image endpoint.
- Categories are seeded by migration `0004_marketplace_catalog.sql`.

Passwords are stored as salted scrypt hashes. New passwords require at least 10 characters, including an uppercase letter, a lowercase letter, and a number. The current MVP does not send verification or password-reset email, and account email verification is not enabled.

## Health endpoints

- `GET /api/health`: confirms the process is running.
- `GET /api/health/db`: runs `SELECT 1` and reports PostgreSQL connection/query status; returns 503 if unavailable.
- `GET /api/v1/health`: confirms the process is running.
- `GET /api/v1/health/ready`: legacy readiness alias for the database check.
- `GET /api/v1/profile/me`, `PATCH /api/v1/profile/me`: retrieve or update account and seller profile/storefront details.
- `GET /api/v1/messages/conversations`, `POST /api/v1/messages/conversations`, `GET /api/v1/messages/conversations/:id/messages`, `POST /api/v1/messages/conversations/:id/messages`, `PATCH /api/v1/messages/conversations/:id/read`
- `GET /api/v1/notifications`, `PATCH /api/v1/notifications/:id/read`, `POST /api/v1/notifications/read-all`
- `POST /api/v1/media/upload`: validates an authenticated seller's image and uploads it to Cloudinary.
- `GET /api/v1/marketplace/storefronts/:slug`
- `GET /api/v1/marketplace/listings/:slug/reviews`, `POST /api/v1/marketplace/listings/:slug/reviews`
- `POST /api/v1/auth/sign-up`, `POST /api/v1/auth/sign-in`, `POST /api/v1/auth/sign-out`, `GET /api/v1/auth/me`
- `GET /api/v1/marketplace/categories`, `GET /api/v1/marketplace/listings`, `GET /api/v1/marketplace/listings/:slug`
- `GET /api/v1/marketplace/listings/mine`, `POST /api/v1/marketplace/listings`, `PATCH /api/v1/marketplace/listings/:id`, `DELETE /api/v1/marketplace/listings/:id`

## Database migrations

Migrations live in `migrations/` and run in filename order. Each file runs in a transaction and is recorded in `schema_migrations`. Applied migrations are never edited; add a new numbered file for every schema change.

- `0001_initial_schema.sql` creates the core marketplace tables.
- `0002_social_campaigns.sql` adds social campaigns.
- `0003_user_profile_fields.sql` adds phone, avatar, and login metadata.
- `0004_marketplace_catalog.sql` seeds marketplace categories and adds an active-session expiry index.
- `0005_locations_and_orders.sql` adds currency preferences, saved user locations, and order records.
- `0006_database_compatibility.sql` safely adds missing compatibility columns and location/order tables to pre-existing databases.
- `0007_marketplace_workflows.sql` adds role-specific listing metadata and conversation lookup indexing.
- `database/schema.sql` is the equivalent fresh-install schema; use it instead of migrations only on a new database.

Listing-based messaging, account/storefront editing, in-app notifications for messages and reviews, listing reviews, and Cloudinary listing uploads are implemented. Reviews are open to signed-in users except the listing owner; the current app does not verify purchases. Email verification and reset delivery, moderation workflows, and administrator provisioning still require implementation before enabling those features in a public launch.
