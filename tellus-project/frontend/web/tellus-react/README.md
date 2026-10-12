# Tellus web

React marketplace connected to the Spring API. Accounts, catalogue, harvests, orders, profiles, grower directory and notifications use real API records. Tokens stay in memory; saved produce and baskets last for the session. Only appearance is persisted.

## Development

Use Node.js 24+, npm ci, then npm run dev. Vite proxies /api to http://127.0.0.1:8080; override TELLUS_API_TARGET for a different development API. Create buyer/grower accounts using signup. Without the API, the client displays an error and offers retry.

Growers publish/edit/withdraw harvests and manage buyer requests. Buyers add available produce to a basket and submit pickup requests. The server checks price, stock, minimum quantities and ownership, reserves stock atomically and computes totals. Interrupted requests retry with the same ID. Growers confirm pickup; payment is arranged directly and is not collected by the app.

Each listing supplies its currency, minimum order, availability date and pickup address. Old incomplete listings cannot be ordered until the grower completes them. Photos come from grower-provided HTTPS URLs.

## Verification and deployment

Run npm run check for ESLint, 16 API tests and a production build. Serve dist/ through HTTPS hosting with /api proxied to Spring. Vite's development proxy is not included in the production build. Alternatively configure VITE_API_BASE_URL as an HTTPS API URL and restrict API CORS to the web origin.

VITE_* values are public build configuration. Do not put secrets in them. Hash navigation needs no page-path rewrite. API errors must never be rewritten to index.html.

See RELEASE.md for tested scope and remaining public-release requirements.
