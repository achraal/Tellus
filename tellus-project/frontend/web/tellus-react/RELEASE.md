# Tellus release status — October 11, 2026

The core pickup marketplace is implemented across the web and supported mobile clients, with a shared API.

## Completed

- Real registration and sign-in with server-assigned roles.
- Grower-owned listing creation, editing, withdrawal and idempotent mobile draft sync.
- Listing currency, minimum quantity, availability date and pickup address.
- Buyer pickup requests with server pricing, stock checks, idempotency and transactional reservation.
- Buyer/grower order history, valid status transitions and stock release on rejection/cancellation.
- Profile reads/updates, optional GPS coordinates and current-password-verified password changes.
- In-app notifications, read state and grower directory.
- Memory-only authentication, role-restricted screens, account-scoped offline drafts and theme selection.
- Client check scripts and CI covering builds plus database integration tests.

## Verification

Backend HTTP tests run against an isolated local MongoDB replica set. They exercise reservations, retries, whole-basket rollback, ownership and roles, status transitions, cancellation, concurrent buyers, draft sync and password token invalidation. Draft queue tests exercise concurrent writes, restart persistence, sync acknowledgements, storage failures, account isolation and corrupt-data preservation. Frontend source checks and static exports are available through the documented scripts.

Final local checks passed: 22 backend tests (including 18 real-database HTTP tests), 16 web tests and 10 mobile catalogue/draft-queue tests, plus lint, TypeScript, backend packaging, the Vite production build and Expo Android/iOS JavaScript bundles and web export. The [October 11 app check](../../../../APP_CHECK.md) documents repaired bugs, browser flows, evidence and remaining security work.

Browser checks used a separate local preview database and covered registration, publishing, web and mobile buyer checkout, grower acceptance, shared order history and mobile offline save/reconnect sync. Checked web screens and the narrow mobile preview had no detectable WCAG A/AA violations or horizontal overflow. Test records are not runtime fallback data. Native Android/iOS device signing, GPS permission behavior, background lifecycle behavior and physical-device testing remain unverified. The CI workflow is configured but has not been run remotely.

## Public deployment requirements

- Production API/web/mobile hosting, HTTPS endpoints and a managed MongoDB replica set.
- Stable signing secret, restricted CORS, backups, monitoring and abuse/rate controls.
- Email verification/recovery provider, support details and operator-approved privacy/service terms.
- Android/iOS signing and device verification.
- Payment or delivery integrations only if those features are required; this version supports pickup requests with direct payment arrangements.

The UI uses English. Full translations, background push delivery, photo uploading and subscription billing are outside the implemented release scope. No production deployment has been performed.
