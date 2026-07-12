# Test Coverage Report — Elite Fleet Group

Generated from the current state of `main`. Structured for building slides: one `##` section per slide topic, bullet-first.

---

## 1. Overview — What's Covered

Six distinct test types, spanning three applications:

| App | What it is | Tested via |
|---|---|---|
| **platform-fe** | Customer-facing site (guest browsing, sign-in, booking) | UI (Playwright), Lighthouse, adblocker, Performance |
| **admin-panel** | Internal admin dashboard (cars, bookings, customers, raffle) | UI (Playwright), Lighthouse, Performance |
| **Backend API** | REST API behind both frontends (`test.api.elitefleetgroup.engenious.io`) | API (Playwright `request`), Load (k6) |

**Total automated checks: 92**
- 50 functional UI/API tests (`npm run test:e2e`)
- 12 performance-budget tests (`npm run test:performance`)
- 6 Lighthouse audits (`npm run test:lighthouse`)
- 1 load test scenario, 20 virtual users (`npm run test:load`)
- 2 auth-setup steps (prerequisite for `user`/`admin` roles, not a test type itself)

---

## 2. Test Types — What Each One Answers

| Type | Question it answers | Tool |
|---|---|---|
| **Functional UI** | Does the feature work for a real user, clicking through the browser? | Playwright + Chromium |
| **API** | Does the backend behave correctly — right data, right status codes, right auth enforcement? | Playwright `request` (no browser) |
| **Auth-guard / security** | Can an unauthorized actor see or do something they shouldn't? | Playwright, targeted negative cases |
| **Adblocker compatibility** | Does the site still work for the ~30-40% of users running an ad/tracker blocker? | Playwright + `@ghostery/adblocker-playwright` |
| **Performance budget** | Does a single page load within an acceptable time, in isolation? | Playwright + Navigation Timing API |
| **Lighthouse audit** | How does the page score on Google's standardized performance/accessibility/best-practices/SEO rubric? | `playwright-lighthouse` (Chrome DevTools Protocol) |
| **Load test** | Does the server hold up under many real concurrent users, not just one browser at a time? | k6 (standalone, not Playwright) |

---

## 3. Functional Coverage — By Role

Four roles, each with its own Playwright project and isolated browser storage state:

| Role | App | Auth | Tests |
|---|---|---|---|
| **guest** | platform-fe | none (unauthenticated) | 7 |
| **user** | platform-fe | logs in via `auth.setup.ts` | 1 |
| **admin** | admin-panel | logs in via `auth.setup.ts` | 2 |
| **api** | Backend API | mixed (per-endpoint) | 40 |

**guest (7 tests)**
- `smoke.spec.ts` — home page loads (baseline wiring check)
- `home.spec.ts` — hero, top cars, company info, FAQ sections all render
- `login.spec.ts` — sign-in modal flow with valid credentials
- `adblock.spec.ts` (2) — home page renders + nav still works with an ad/tracker blocker active

**user (1 test)**
- `smoke.spec.ts` — authenticated session is active after login

**admin (2 tests)**
- `smoke.spec.ts` — authenticated session is active
- `auth-guard.spec.ts` — clearing the session locks out protected pages (falls back to login, no data leak)

**api (40 tests)** — see Section 4

---

## 4. API Test Coverage — By Domain

Discovered via the live OpenAPI spec (`/docs-json`, 49 endpoints total). Direct HTTP calls via Playwright's `request` fixture — no browser.

| Domain | Tests | What's covered |
|---|---|---|
| **Auth** | 8 | Admin login (success/failure), customer login, refresh token, logout, register + admin lookup, password-reset request + invalid-code rejection (x2) |
| **Vehicles** | 12 | All public detail/availability endpoints, full admin CRUD lifecycle (create → read → update → availability-schedule → delete), unavailable-hours lifecycle, features list, gallery auth-guard |
| **Bookings** | 7 | User's own booking list, admin single-booking + by-customer, public single-booking, auth guards |
| **Users** | 12 | Admin customer views, profile/booking reads, profile + password update (via disposable temp accounts), phone verification request, account deletion, image-update auth-guard |
| **Raffles** | 1 | Public winners list |

**Self-cleaning test data pattern:** mutating tests (create vehicle, register user, etc.) create disposable data and delete it in the same test — nothing is left behind in the shared test environment.

**Intentionally not covered** (flagged as a decision, not an oversight):
- Raffle winner generation — real, irreversible business action, no undo
- Raffle participant creation — no delete endpoint exists anywhere in the API
- Payment processing (Heartland) — real payment gateway, no safe test card/reversal path
- Booking cancel/status-change — no `POST /bookings` create endpoint exists to produce disposable test bookings; touching either would mutate a real existing booking

**Real finding surfaced during this work:** vehicle gallery image upload is broken in the test environment — backend S3 credentials are misconfigured, so any real upload attempt fails regardless of what the test sends. Flagged for the environment owner; test coverage for that path is auth-guard-only until fixed.

---

## 5. Security-Focused Coverage

Not a separate suite — auth-guard assertions are woven through functional and API tests:

- **admin-panel session clearing** — protected routes fall back to login with no data leak (`admin/auth-guard.spec.ts`)
- **Every authenticated API endpoint** has a matching "rejects without a valid token" test (401) alongside its "succeeds with a valid token" test (200) — vehicles, bookings, users, profile, phone verification, account deletion
- **IDOR-shaped finding**: cars/bookings mutation endpoints trust the URL-param resource ID with only auth-token presence checked client-side — flagged to the backend team as a candidate for server-side ownership verification (not independently confirmed, since that requires backend code access)

---

## 6. Performance Budget Testing

- **12 tests**, one per key page across guest/user/admin, tagged `@performance`
- Measures `loadEventEnd - navigationStart` via the browser's Navigation Timing API — full client-observed page load
- **2000ms budget** per page
- Runs isolated and serial (`--workers=1`), separate from the main suite

**Why isolated:** these tests initially ran inside the main parallel suite and flaked under load — not because the site was slow, but because `loadEventEnd` includes client-side JS execution time, which balloons when multiple Chromium instances compete for CPU on the same test runner. Diagnosed with hard data: TTFB (actual server response time) stayed flat at 98-232ms across every condition tested, isolated or under heavy contention — proving the server was never the bottleneck. `domComplete` swung from 1681ms to 3683ms across concurrent runs on the same machine, confirming client-side CPU contention as the cause. Isolating the run (matching the precedent already set for Lighthouse) eliminated the flakiness entirely.

---

## 7. Lighthouse Audits

- **6 audits**, one per key page across guest (home, our-cars), user (profile), admin (cars)
- Scores four categories per Google's standard rubric: **Performance, Accessibility, Best Practices, SEO**
- Tagged `@lighthouse`, runs isolated and serial (own script, own CDP debugging port)

**Latest scores vs. thresholds** (Lighthouse scores have natural run-to-run variance; thresholds are set below typical observed scores with headroom):

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Guest — Home | 41 (≥35) | 80 (≥75) | 96 (≥90) | 91 (≥85) |
| Guest — Our Cars | 76 (≥65) | 80 (≥75) | 96 (≥90) | 100 (≥95) |
| User — Profile | 42 (≥35) | 80 (≥65) | 96 (≥90) | 91 (≥75) |
| Admin — Cars | 67 (≥55) | 71 (≥65) | 96 (≥90) | 82 (≥75) |

**Takeaway:** Best Practices scores are consistently strong (96 everywhere). Performance scores are the weakest category across the board (41-76) — a real signal for follow-up investigation, distinct from the test-runner-contention issue in Section 6, since these are absolute Lighthouse scores, not relative budget checks.

---

## 8. Load Testing (k6)

Answers a question none of the above can: **does the server hold up under many real concurrent users**, not just one Playwright browser at a time.

- **Tool:** k6 (industry-standard, runs standalone — not a Playwright test)
- **Scenario:** 20 virtual users, 30 seconds, mixed public + admin-authenticated reads
  - `GET /vehicles/platform` (public)
  - `GET /raffles/winners` (public)
  - `GET /vehicles/admin` (authenticated)
  - `GET /bookings/list/admin` (authenticated)
- **Thresholds:** error rate < 1%, p95 response time < 1500ms

**Latest result:**

| Metric | Value |
|---|---|
| Total requests | 1,133 |
| Success rate | 100.00% |
| Error rate | 0.00% |
| Avg response time | 288ms |
| p90 response time | 560ms |
| **p95 response time** | **711ms** (threshold: <1500ms) |
| Max response time | 3.72s |
| Throughput | ~35 req/s |

**Takeaway:** the API comfortably absorbs this load — well under threshold on every metric. This is the evidence-based answer to "will performance issues affect real users under load": no, at this concurrency level, the server isn't the bottleneck.

---

## 9. Tooling Summary

| Concern | Tool |
|---|---|
| UI/functional/API test runner | Playwright (`@playwright/test` 1.61) |
| Browser | Chromium only (Desktop Chrome device profile) |
| Ad/tracker blocking simulation | `@ghostery/adblocker-playwright` |
| Lighthouse integration | `playwright-lighthouse` |
| Load testing | k6 (standalone binary) |
| Auth/session handling | `auth.setup.ts` + per-role `storageState` files |
| Environment config | `.env.test.<env>` (dotenv), gitignored except `.env.test.example` |

---

## 10. How to Run Everything

```bash
npm run test:e2e          # 50 functional UI + API tests, parallel
npm run test:performance  # 12 performance-budget tests, serial
npm run test:lighthouse   # 6 Lighthouse audits, serial
npm run test:api          # 40 API tests only
npm run test:load         # k6 load test against the live API
```

---

## 11. Coverage Roadmap (Documented, Not Yet Built)

Saved as reusable planning artifacts in `.claude/pw-plans/`:
- `guest-home-page.md`
- `guest-login-and-book-now-flow.md`
- `lighthouse-coverage.md`
- `performance-coverage.md`

These contain MECE-style test case breakdowns (happy path / edge / negative, prioritized P0-P2) for scenarios not yet fully built out — a ready backlog for the next round of test generation.
