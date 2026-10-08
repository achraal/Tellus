# Tellus Web

React web client using the mobile forest-green theme. The runtime contains no sample accounts, catalogue, orders, notifications or stock photography.

## Local development

Use Node.js 20.19+, 22.13+, or 24+.

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local` and configure the real catalogue currency.
3. Start the Spring API, or set `TELLUS_API_TARGET` to its development address.
4. Run `npm run dev` and open the URL printed by Vite.
5. Sign in with an existing Tellus account, or use **Create an account** (`#signup`).

The default API base is `/api`. Vite proxies that path to `http://127.0.0.1:8080` during development. The proxy does not apply to production builds or Vite preview. Without a running API, signing in displays a service error; no fallback account or catalogue is created.

## Real service integration

- Login: `POST /api/auth/login`, using the existing `email` / `password` request and `token` / `email` / `role` response.
- Signup: `POST /api/auth/register`, with name, email, optional business name, password and buyer/grower role. Confirmation remains client-side. A plain-text success response returns the user to sign-in; it does not create a local session.
- Catalogue: authenticated `GET /api/produits`, mapped from the existing Spring `Produit` model.
- Account role comes from the login response and cannot be switched in the browser.
- Authentication tokens stay in memory and are never written to browser storage. Reloading requires another sign-in. A 401 catalogue response signs out.
- A loading screen, empty catalogue, unavailable API and malformed response are distinct states.
- Product photos come only from HTTPS URLs in live listings. Missing or failed photos get a neutral placeholder.
- Product availability uses stock, server status and the availability date. No grower identity, certification, minimum quantity, location, delivery quote or currency is invented.
- Saved items and planning baskets are session-only. Signing out clears them. Only appearance is stored.
- Known `tellus.web.v1.*` demo keys are removed on startup. Other browser data is left intact.

## Service limitations

This frontend is **not yet a complete shippable marketplace**. The repository API does not expose buyer checkout/history, account updates, grower profiles or notification history. These screens state their unavailability; there are no simulated writes or payments. A basket is explicitly a planning list, without stock reservation.

Harvest writes and seller order changes are not wired up while server ownership and authorization checks remain incomplete. See [RELEASE.md](./RELEASE.md) for the concrete launch blockers. Signup now validates registration server-side and prevents caller-provided IDs, internal fields and administrator roles. The mobile app is unchanged; its registration requests must meet the same 12–128 character password and required-name rules.

## Build and deploy

Run `npm run check` for ESLint, API contract/error-path tests and a production build. Deploy `dist/` through an HTTPS web server; do not use the development server in production.

Prefer same-origin hosting that proxies `/api/*` to Spring and serves static files for the web client. Never rewrite API errors to `index.html`. Alternatively, set `VITE_API_BASE_URL` to an HTTPS API base URL before building and configure restricted CORS on that API.

`VITE_*` values are public browser configuration, never secrets. Set `VITE_CURRENCY` to the currency actually used by the backend's prices; the backend currently omits a currency field. An unset currency is displayed as unspecified.

Hash navigation needs no path rewrite rules. Serve `index.html` with revalidation and hashed `assets/` with immutable caching. Source maps are disabled. Configure security headers and API/image origin restrictions for the actual hosting environment, then verify login and catalogue against the deployed API.

## Structure

- `src/App.jsx`: authentication and workspace flows.
- `src/lib/api.js`: requests, contracts, availability and legacy storage cleanup.
- `src/App.css`, `src/ux.css`: responsive layout and mobile theme.
- `src/components/Modal.jsx`, `src/hooks/useDrawer.js`: keyboard focus and modal navigation.

Historical UI findings in `AUDIT.md` describe the earlier prototype; they do not certify this release.
