# Lighthouse Performance Coverage

## Context

The existing Playwright-native performance tests (Navigation Timing API, `playwright-utils/helpers/performance.ts`) only measure raw page-load time. They don't catch regressions in render-blocking resources, accessibility, SEO, or Lighthouse's broader "best practices" checks. Added a Lighthouse-based layer as a complement, not a replacement. Decisions made: all four Lighthouse categories (Performance, Accessibility, Best Practices, SEO), and `playwright-lighthouse` (runs Lighthouse audits inside existing Playwright tests via CDP) rather than a standalone Lighthouse CLI/LHCI pipeline.

## Implementation

### Dependency
`playwright-lighthouse@^4.0.0` added as a devDependency.

### `playwright-utils/helpers/lighthouse.ts`
```typescript
import type { Page } from '@playwright/test'
import { playAudit } from 'playwright-lighthouse'

const LIGHTHOUSE_PORT = 9222

type LighthouseThresholds = {
  performance: number
  accessibility: number
  'best-practices': number
  seo: number
}

export async function runLighthouseAudit(page: Page, thresholds: LighthouseThresholds): Promise<void> {
  const basicAuthHeader = process.env.BASIC_AUTH_USER
    ? { Authorization: `Basic ${Buffer.from(`${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASSWORD}`).toString('base64')}` }
    : undefined

  await playAudit({ page, thresholds, port: LIGHTHOUSE_PORT, opts: basicAuthHeader ? { extraHeaders: basicAuthHeader } : undefined })
}
```

### Critical finding: Lighthouse's navigation doesn't inherit Playwright's Basic Auth
`playwright-lighthouse` drives its own navigation over CDP, separate from Playwright's own request interception. Playwright's `httpCredentials` context option (used for the staging environment's HTTP Basic Auth wall) does **not** carry over to Lighthouse's internal navigation — every audit initially failed with `ERRORED_DOCUMENT_REQUEST` and all scores read `0`. Fixed by manually building an `Authorization: Basic ...` header from `BASIC_AUTH_USER`/`BASIC_AUTH_PASSWORD` and passing it via Lighthouse's own `opts.extraHeaders`. Confirmed via `curl`: the main platform (`BASE_URL`) returns `401` without credentials; the admin panel (`ADMIN_BASE_URL`) returns `200` without credentials (no basic-auth wall there) — the extra header is harmless to send regardless.

### Critical finding: the CDP debugging port must NOT be global
Initial implementation added `--remote-debugging-port=9222` to `playwright.config.ts`'s top-level `use.launchOptions`. This broke the entire regular suite: every parallel worker's browser tried to bind the same fixed port and crashed with `Address already in use`. **Fixed** by removing it from the config entirely and scoping it only inside each Lighthouse spec file via a top-level (not inside `describe`) `test.use({ launchOptions: { args: ['--remote-debugging-port=9222'] } })` — Playwright rejects `launchOptions` inside a `describe` block ("forces a new worker"), so it must be at file top-level. Combined with running Lighthouse tests via `--workers=1`, only one browser ever holds the port at a time.

### npm scripts
```json
"test:e2e": "playwright test --grep-invert @lighthouse",
"test:lighthouse": "playwright test --grep @lighthouse --workers=1"
```
Lighthouse tests are tagged `@lighthouse` in their titles. `test:e2e` explicitly excludes them so the default suite stays fast and parallel; `test:lighthouse` is the only supported way to run them (serialized, one worker). **Do not run bare `npx playwright test` with no filter** — it mixes Lighthouse tests into the default parallel run and reintroduces the port conflict (`ERRORED_DOCUMENT_REQUEST` / score `0`) since it doesn't respect either npm script's flags.

### Test files and pages covered (initial scope, smaller than Navigation Timing pass)
Lighthouse audits are heavyweight (~5-10s each, serialized) — kept to the highest-traffic, lowest-setup pages for v1:

`tests/guest/lighthouse.spec.ts`:
- Home (`/`) — thresholds: performance 35, accessibility 75, best-practices 90, seo 85 (measured: 44-45 / 80 / 96 / 91)
- Our Cars (`/our-cars`) — thresholds: performance 65, accessibility 75, best-practices 90, seo 95 (measured: 72-76 / 80 / 96 / 100)

`tests/user/lighthouse.spec.ts`:
- Profile (`/profile`) — thresholds: performance 35, accessibility 65, best-practices 90, seo 75 (measured: 44-45 / 80 / 96 / 91)

`tests/admin/lighthouse.spec.ts`:
- Cars (`/cars`) — thresholds: performance 55, accessibility 65, best-practices 90, seo 75 (measured: 67 / 71 / 96 / 82)

Thresholds set with headroom below measured scores (more buffer on `performance`, the noisiest metric) after confirming scores were stable across repeated runs. Sanity-checked by setting `HOME_PAGE_THRESHOLDS.performance` to `101` (impossible), confirming `playAudit` throws with the real measured score reported, then restored.

## Verification
- `npm run test:e2e` — 17/17 pass, no Lighthouse tests included, no port conflicts
- `npm run test:lighthouse` — 6/6 pass (2 auth-setup + 4 audits), real measured scores at or above threshold
- Confirmed bare `npx playwright test` (unsupported) reproduces the port-conflict failure mode as a regression guard for future readers

## Out of scope
- Booking flow / T&Cs / Payment / About Us Lighthouse audits — candidate follow-up; would reuse `seedBookingSession` from `playwright-utils/helpers/booking.ts`
- CI wiring — no `.github/workflows` exists yet in this repo; `test:lighthouse` is runnable locally on demand
- Historical trend tracking / HTML report publishing — that's what LHCI specializes in; out of scope per the `playwright-lighthouse` tooling decision
