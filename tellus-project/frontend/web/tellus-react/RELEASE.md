# Launch status — October 8, 2026

Signup follow-up: added the `#signup` page, validated buyer/grower registration, password confirmation, duplicate/error handling and server-confirmed success returning to sign-in. Frontend lint, 14 tests and production build pass. Browser signup flows and automated accessibility scans passed at 390px and 1440px with isolated API responses. Maven compilation and three controller registration tests pass; these tests mock the repository and do not verify MongoDB or a deployed service. Corrected Maven properties-file encoding to allow the existing resource to build.

The sample-data frontend has been replaced with a real sign-in and authenticated catalogue client. Do not label the complete marketplace production-ready until the following issues are resolved.

## Required deployment inputs

- Production API address and hosting provider.
- Actual catalogue currency.
- Working account and deployed database for integration verification.
- HTTPS routing, API CORS if cross-origin, response headers, logging and operational monitoring.

Neither a production deployment nor a live account integration test has been performed.

## Backend blockers found in the repository

1. `AuthTokenFilter.java` creates authentication with no authorities. `SecurityConfig.java` does not enable method security. The `@PreAuthorize` annotations on order actions therefore do not establish a reliable role boundary as configured.
2. Product create/update/delete/sync accepts caller-supplied records without checking ownership against the authenticated user. Enforce ownership on every write. Public registration has now been restricted to a validated DTO allowing only buyer/grower roles and no caller-supplied IDs or internal fields. Verify the database unique email index, email verification/recovery and rate limiting before public registration is launched.
3. `CommandeController.updateStatus` loads an order by ID and updates it without checking that the caller owns the sale or that the requested state transition is valid.
4. Buyer order creation/history and delivery details have no controller endpoints. Checkout needs server-side pricing, stock validation/reservation, ownership and idempotency before it can be enabled.
5. Public account recovery, profile reads/updates, a grower directory and notification history need supported API contracts. No identity or notification data should be inferred from sample content.
6. Catalogue prices lack currency; listings lack minimum order quantities and grower display details. Add explicit fields or establish a documented service-wide currency before launch.

The web client intentionally does not call these unsafe or missing mutation endpoints. Hiding controls is not a backend authorization fix. Backend remediation and authenticated integration tests remain required before a public launch.

## Frontend verification

Run `npm run check`. Unit tests exercise request headers, HTTP/network failure behavior, invalid response handling, account role contracts, listing validation, safe photo schemes, stock/date availability and scoped removal of legacy browser keys.

Browser tests may stub API responses to exercise UI states. Such tests are isolated test inputs, never runtime fixtures, and do not prove a deployed backend works. Verify the real service separately before release.

Verified locally: ESLint, all 12 API tests and the production build pass. Isolated browser checks passed for rejected login, empty catalogue, HTTP 503 with retry/recovery, listing details and planning basket, HTTP 401 sign-out, no token in localStorage, and legacy-key removal. Marketplace scans found no horizontal page overflow at 320, 390, 768 or 1440px and no automated WCAG A/AA violations at those widths. Sign-in and settled dark-theme marketplace scans also passed; theme transitions must complete before measuring contrast. Test request stubs were removed afterward. The local Spring API was unreachable, so real authentication and catalogue integration remain unverified.
