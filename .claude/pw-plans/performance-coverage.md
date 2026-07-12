# Playwright-Native Performance Coverage

## Context

The repo had no performance testing — no Lighthouse, k6, or web-vitals instrumentation in `platform-fe/src`, and `playwright.config.ts` had no perf-specific project. Started with lightweight Playwright-native checks (Navigation Timing API) instead of standing up a separate tool, reusing the existing Playwright/CI setup rather than adding new infra to maintain.

**Actor:** Guest and Authenticated User
**Feature area:** Cross-cutting performance instrumentation (`playwright-utils/helpers/performance.ts`)
**Primary goal:** Assert that key pages load within an agreed time budget, using real browser Navigation Timing data — not a synthetic Lighthouse score.

## Implementation

### Helper: `playwright-utils/helpers/performance.ts`
```typescript
import type { Page } from '@playwright/test'

export async function getPageLoadDuration(page: Page): Promise<number> {
  return page.evaluate(() => {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    return entry.loadEventEnd - entry.startTime
  })
}
```

### Deliberate deviation from "always start from home page"
Functional tests must start at `/` and click through, per `.claude/rules/playwright-scripting.md`. Performance checks are different in kind — they measure a single page's raw load cost, and chaining through prior navigations would contaminate the Navigation Timing entry. So performance tests use `page.goto(<path>)` directly to the page under test, with a one-line comment in each spec calling this out.

### Test files and pages covered

`tests/guest/performance.spec.ts` (`guest` project — no auth):
- Home (`/`) — budget 2000ms, measured baseline ~680-900ms
- Our Cars (`/our-cars`) — budget 2000ms, measured baseline ~220-830ms
- About Us (`/about-us`) — budget 2000ms, measured baseline ~210-840ms
- Booking (`/booking`, sessionStorage seeded) — budget 2000ms, measured baseline ~685-810ms

`tests/user/performance.spec.ts` (`user` project — uses `user` storageState):
- Profile (`/profile`) — budget 2000ms, measured baseline ~690-960ms
- Booking (`/booking`, sessionStorage seeded) — budget 2000ms, measured baseline ~660-920ms
- Booking Terms & Conditions (`/booking/terms-and-conditions`, sessionStorage seeded) — budget 2000ms, measured baseline ~210-940ms
- Booking Payment (`/booking/payment`, sessionStorage seeded) — budget 2000ms, measured baseline ~210-945ms

`tests/admin/performance.spec.ts` (new, `admin` project — uses `admin` storageState + `ADMIN_BASE_URL`):
- Cars (`/cars`) — budget 2000ms, measured baseline ~655-940ms
- Bookings (`/bookings`) — budget 2000ms, measured baseline ~230-865ms

Each test: `page.goto(path)` → `getPageLoadDuration(page)` → `expect(duration).toBeLessThan(<budgetMs>)`.

### Reaching booking-flow pages: seeded sessionStorage
`/booking` (DriverInformation) redirects to `/` unless `sessionStorage.booking` is set (client-side guard only, no server-side validation of its shape at this stage — `platform-fe/src/components/pages/driver-information/InformationWrapper/index.tsx`). `/booking/terms-and-conditions` and `/booking/payment` are additionally `PrivateRoute`-protected, so only the `user` project can reach them; `guest` can only reach `/booking` itself.

New helper `playwright-utils/helpers/booking.ts` seeds a minimal valid booking object before navigation:
```typescript
import type { Page } from '@playwright/test'

export async function seedBookingSession(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.setItem('booking', JSON.stringify({ additionalServices: [] }))
  })
}
```
`additionalServices` is the only non-optional field on `BookingType` (`platform-fe/src/services/types/booking.ts`), so `{ additionalServices: [] }` is sufficient. `addInitScript` must be called before `page.goto()`.

Each booking-flow test also asserts `expect(page).toHaveURL(<path>)` before measuring — without this, a broken seed would silently redirect to `/` and the test would still "pass" by measuring the home page's load time instead of the intended page's.

### Budgets are measured, not guessed
Ran each page against the live test environment to get real baselines (all landed ~200-960ms, including the booking-flow and admin pages — no slower than the static pages despite fetching dynamic data), then set budgets to 2000ms — roughly 2-3x headroom over the worst observed local run, generous enough to absorb normal/CI variance while still catching real regressions. Sanity-checked the assertion itself twice: first by temporarily setting `HOME_PAGE_BUDGET_MS` to `1` (first pass), then `CARS_PAGE_BUDGET_MS` to `1` (this extension) — both correctly failed with the real measured duration reported, then restored.

## Verification
- `npm run test:e2e` — all 16 tests pass (4 guest, 4 user, 2 admin smoke+performance, 2 auth-setup, plus original login/smoke specs)
- Sanity checks performed: lowering `HOME_PAGE_BUDGET_MS` and `CARS_PAGE_BUDGET_MS` to `1` each correctly failed the assertion; both restored to `2000` afterward

## Out of scope
- `/cars/:id`, `/bookings/:id` (dynamic admin ID pages) — need a known-valid ID, more setup for marginal signal
- Web Vitals (LCP, CLS, INP) — Navigation Timing gives a simpler single "load time" number to start with; Web Vitals would need `web-vitals` library injection or CDP, more setup
- CI-specific perf budget tuning (CI machines are typically slower/noisier than local) — likely follow-up once this suite runs in CI; current budgets were only measured locally
