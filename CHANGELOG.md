# Changelog

## v0.1.0 - 2026-11-03

First release of BizzLeap SME, a marketplace connecting farmers, small businesses, and buyers.

### Features

- Database-backed registration and login for farmers, small business owners, and buyers.
- Seller storefront and listing management, public product discovery, category filtering, and Cloudinary image uploads.
- Listing-based messaging, reviews, and in-app notifications.
- PostgreSQL migrations, health checks, and structured request-correlated server logging.

### Quality and deployment

- Added auth, marketplace, profile, and authentication-page tests, with a 50% minimum line-coverage gate.
- Added reproducible npm installation, Docker Compose for local app and PostgreSQL startup, and GitHub Actions checks for lint, type-checking, builds, tests, and dependency auditing.
- Added weekly npm dependency update checks with Dependabot.

### Known limitations

- Docker Compose startup was not verified in the development environment because Docker was unavailable.
- `npm audit` reports two moderate React Router advisories; the available fix requires a major-version upgrade and was deferred for a compatibility review.
