# Healora — Applied Fixes

Merged from `Healora-fixes` into the main project.

## Backend

- **server.js** — Fixed Express app hoisting bug; added rate limiting on AI and API routes
- **validationMiddleware.js** — Input validation for register, login, and contact
- **authRoutes.js** — Validation on register/login
- **contactRoutes.js** — Validation on contact form
- **package.json** — Added `express-rate-limit` and `express-validator`
- **.env.example** — Complete environment variable template

## Frontend (classic)

- **ErrorBoundary.jsx** — Prevents full-app white-screen crashes
- **App.js** — Wraps routes with ErrorBoundary

## Frontend-v2 (from healora-project)

- Modern TanStack Start UI in `frontend-v2/`
- **api.ts** — API client wired to Express backend
- **auth-store.ts** — Real JWT login/register (replaces demo mock auth)
- **login.tsx / register.tsx** — Connected to backend API

## Security reminder

If `.env` was ever committed or shared, rotate MongoDB password, API keys, JWT secret, and email app password.
