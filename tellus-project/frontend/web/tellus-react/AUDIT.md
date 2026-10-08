# Tellus frontend audit — 7 October 2026

## Result

The web frontend is suitable for continued demo development. The audit found and fixed dependency, accessibility, navigation, dialog, and local-data issues. Connecting the application to real customers and growers still requires the server integration described below.

Scope: `tellus-project/frontend/web/tellus-react`. Existing mobile changes and unrelated repository changes were preserved. This audit covers the frontend; it does not assess backend authentication, APIs, or deployment security.

## Findings addressed

| Priority | Finding | Change |
| --- | --- | --- |
| High | Vite 8.0.1 was affected by five development-server advisories, including file-access issues on Windows. npm reported one vulnerable dependency at high severity. | Updated to Vite 8.3.3 and restarted the local development server. The server remains bound to loopback. |
| High | Light-theme secondary text and status colors were below the tested contrast requirements. The initial overview scan found 62 affected nodes; dark mode found three. | Replaced scattered low-contrast foregrounds with a shared theme-aware muted color and corrected status colors. Kept the mobile palette and layout. |
| Medium | Entering zero in a basket quantity removed the product immediately. Other invalid drafts could propagate into application state. | Quantity drafts stay inside the dialog. Only valid whole-kilogram quantities update the cart. Removal is an explicit action, invalid fields show an error, and checkout is disabled until valid. |
| Medium | Clicking empty padding inside a dialog closed it and could discard a harvest form. | Backdrop dismissal checks pointer coordinates outside the dialog bounds. Dialogs have unique accessible title IDs and restore focus on close. |
| Medium | Mobile navigation allowed keyboard focus behind the open drawer. | Added an explicit close control, focus containment, Escape dismissal, focus restoration, and an inert main area. Drawer and dialog scroll locks coordinate when one opens while the other closes. |
| Medium | Saved-data validation accepted incomplete order records, duplicate cart products, inconsistent totals, and invalid harvest ranges. Inherited hash names such as `#constructor` also passed the route check. | Extracted testable validation contracts, checked required fields and ranges, rejected duplicate identities and inconsistent totals, and used own-property route resolution. Invalid data falls back to defaults. |
| Low | The empty basket’s “Explore marketplace” button only closed the dialog. Nearby discovery could inherit a stale saved-only filter. | Added explicit marketplace navigation and reset unrelated filters for discovery/search shortcuts. |
| Low | Removing all harvests left an unexplained empty page. | Added an empty state with an Add harvest action. |
| Low | The frontend had no runnable lint command or combined verification command. | Added supported ESLint tooling, Hooks checks, `npm run lint`, `npm run check`, and six additional regression tests. |

## Dependency upgrades

| Package | Before | After |
| --- | --- | --- |
| `react` | 19.2.4 | 19.3.0 |
| `react-dom` | 19.2.4 | 19.3.0 |
| `vite` | 8.0.1 | 8.3.3 |
| `@vitejs/plugin-react` | 6.0.1 | 6.1.2 |

Added development-only lint and accessibility tooling. Versions are pinned in `package.json` and the lockfile. `npm audit` reported zero known vulnerabilities and `npm outdated` returned no outdated direct dependencies at the time of this audit. These results are a snapshot of registry advisories, not a guarantee about future vulnerabilities.

References: [Vite Windows file-access advisory](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff), [Vite release support](https://vite.dev/releases), [React 19.3 release notes](https://react.dev/blog/2026/09/09/react-19-3). The Windows advisory describes exposure conditions for network-accessible development servers; this project uses a loopback address.

## Verification

- ESLint, 11 unit/regression tests, and production build pass with Node.js 24.
- axe-core scans using WCAG 2 A/AA and WCAG 2.1 AA tags found no violations across Overview, Marketplace, Orders, Growers, Activity, Settings, and Harvests in both light and dark themes.
- Browser checks passed for empty-basket navigation, quantity limits, explicit removal behavior, preserving valid stored cart quantities, and a 75 kg kale checkout totaling $180.
- Browser checks passed for dialog padding clicks, mobile Tab containment, Escape/focus restoration, drawer-to-dialog scroll locking, nearby-filter reset, and invalid hash fallback.
- Browser console reported no errors during these interaction checks.
- All seven pages fit without page-level horizontal overflow at 320, 768, and 1440 pixels. Desktop and phone screenshots were visually reviewed.

Automated accessibility scans cover detectable issues in the tested states. Full screen-reader testing and a wider device/browser matrix remain useful before a public release.

To repeat the source checks:

```sh
npm ci
npm run check
npm audit
```

## Recommended next upgrades

1. **Connect the Spring API and authentication.** Replace fixture products and local orders with an API layer, authenticated sessions, server-enforced roles, loading/error/retry states, and server-authoritative price and stock validation. The current role selector is a demo view switch, and repeated demo orders do not reserve inventory.
2. **Make purchasing complete.** Define delivery fees, pickup/delivery options, payment handling, order cancellation, and real invoice requirements. The current download is clearly labeled as a demo text summary; no actual order or payment is sent.
3. **Add repeatable release checks.** Put lint, unit tests, builds, and critical browser flows in CI. Cover persisted-state recovery, offline behavior, and at least Chromium, Firefox, and WebKit.
4. **Split the workspace into page modules.** `App.jsx` still combines several page layouts and state transitions. Extracting pages, cart actions, and persistence into dedicated modules will make backend integration and future tests easier. Consider cross-tab state coordination if local storage remains part of the product.
5. **Replace sample business assumptions.** Confirm target region, currency, languages, actual delivery radius, grower verification, and inventory units before replacing the mobile-derived sample content with live data.

Backend integration is the highest-value next step. The frontend currently saves demo changes only in the current browser.
# Historical prototype audit

Superseded for release purposes by [RELEASE.md](./RELEASE.md). The October 8 frontend removes sample data and simulated transactions; the results below describe the earlier prototype.

# UI/UX follow-up — October 7, 2026

Implemented readable product text and larger controls, buyer shortcuts, persistent mobile navigation, basket access in both workspaces, current-price repeat ordering with stock checks, removable filter chips, representative product photography with SVG fallback, and explicit checkout cost/arrival uncertainty. Harvest dates remain unconfirmed pending grower data.

Validation: `npm run check` passes (ESLint, 13 tests, production build). Browser checks covered search preservation through product details, adding to basket, demo checkout, reorder, filter reset and mobile navigation. No horizontal page overflow at 320, 390, 768 or 1440px. Automated WCAG A/AA scans returned zero violations for the mobile Home, Market and Orders screens in light and dark themes, desktop marketplace, and the basket dialog. These checks do not constitute full accessibility certification.

