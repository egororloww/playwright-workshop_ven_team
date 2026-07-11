# Coverage Plan: Guest views the home page

**Actor:** Guest (unauthenticated visitor)
**Feature area:** platform-fe — home page (`/`)
**Primary goal:** An unauthenticated visitor loads `/` and can see and interact with all key home page sections (hero, top cars, company info, FAQ) and header navigation.
**Suggested file:** `tests/guest/home.spec.ts` (new — keeps `tests/guest/smoke.spec.ts` as the minimal wiring check, this file holds detailed coverage)
**Existing related tests:** `Guest smoke > Home page loads` (asserts only that URL is `/` after navigating — no content assertions)

## Assumptions
- Home page renders five sections in order: Hero, "Our TOP CARS" (`OurTopCars`), "ELITE FLEET GROUP" (`EliteFG`), "Why Us", FAQ — per `platform-fe/src/pages/Landing/index.tsx`.
- No cookie banner, newsletter popup, or blocking modal appears on initial load, so tests can assert content immediately after `page.goto('/')`.
- Desktop Chrome only (project convention) — using desktop-visible nav/button variants, not mobile ones.
- Cars list is fetched via `useSuspenseQuery`; on success it renders car cards, on empty array it silently renders nothing, on failure it throws into a Suspense boundary showing an indefinite `Loader`. There's no distinguishable UI for "empty" vs "still loading" vs "errored" — these three states aren't reliably assertable via E2E without network interception, so they're out of scope (flagged below).

## Test cases

### Happy path
1. **Guest sees the home page hero and all key sections** — verifies the full page renders on load _(P0)_
   - Pre: none (unauthenticated)
   - Steps: Navigate to `/`
   - Expect: Hero "Book Now" button visible; "Our TOP CARS" heading visible; "ELITE FLEET GROUP" heading visible; "Why Us" heading visible; "FAQ" heading visible

2. **Guest sees available cars listed under Our Top Cars** — confirms the cars data section renders content _(P0)_
   - Pre: at least one car exists in the test environment
   - Steps: Navigate to `/`
   - Expect: At least one car card/image is visible within the "Our TOP CARS" section

3. **Guest can navigate to Our Cars page from the header** _(P1)_
   - Pre: none
   - Steps: From `/`, click "Our Cars" in header nav
   - Expect: URL is `/our-cars`

4. **Guest can navigate to About Us page from the header** _(P1)_
   - Pre: none
   - Steps: From `/`, click "About Us" in header nav
   - Expect: URL is `/about-us`

5. **Guest can navigate to About Us via the Elite Fleet Group "Read More" link** — alternate path to the same destination as #4 _(P2)_
   - Pre: none
   - Steps: From `/`, scroll to Elite Fleet Group section, click "Read More"
   - Expect: URL is `/about-us`

6. **Guest can view all cars via "View All Cars" in the Our Top Cars section** — alternate path to `/our-cars` _(P1)_
   - Pre: none
   - Steps: From `/`, click "View All Cars"
   - Expect: URL is `/our-cars`

7. **Guest can open the Sign In modal from the header** _(P1)_
   - Pre: none
   - Steps: From `/`, click "Sign In" in header
   - Expect: Auth modal with Email/Password fields is visible

8. **Guest can open the Book Now drawer from the header** _(P1)_
   - Pre: none
   - Steps: From `/`, click "Book Now" in header
   - Expect: Booking drawer/modal is visible

9. **Guest can expand and collapse an FAQ item** — state boundary: collapsed vs expanded _(P1)_
   - Pre: none
   - Steps: From `/`, scroll to FAQ section, click a question item, click it again
   - Expect: Answer becomes visible after first click, hidden again after second click

### Edge cases
10. **Guest returns to a fully-rendered home page via browser back button** — navigation edge _(P2)_
    - Pre: none
    - Steps: From `/`, navigate to `/our-cars`, then click browser back
    - Expect: URL is `/`, key sections (hero, Our TOP CARS heading) are visible again

11. **Guest sees the home page correctly after a full page refresh** _(P2)_
    - Pre: none
    - Steps: Navigate to `/`, reload the page
    - Expect: Key sections are visible after reload

12. **Guest returns home by clicking the logo from another page** _(P2)_
    - Pre: none
    - Steps: Navigate to `/our-cars`, click the header logo
    - Expect: URL is `/`

### Negative cases
13. **Guest visiting an invalid route sees a not-found experience** _(P1, `?`)_
    - Pre: none
    - Steps: Navigate to `/this-route-does-not-exist`
    - Expect: A not-found page/message is shown (exact behavior unconfirmed — see Open questions)

## Out of scope
- **Cars section empty-array state** — renders no distinguishable "no cars" UI; not observable/assertable via E2E.
- **Cars API loading state (Suspense `Loader`)** — a transient rendering detail; asserting it reliably requires artificial network throttling/mocking, which the project's conventions avoid.
- **Cars API failure state** — throws into Suspense with no visible error boundary/message; same reasoning as above, not observable through the UI as currently implemented.

## Open questions
- Does the router define a dedicated 404/not-found page for unmatched routes, or does it fall through to something else (blank page, redirect to `/`)? Unconfirmed during research — confirm before generating test #13, or drop it if there's no dedicated not-found UI.
- Should FAQ expand/collapse (#9) live in this "home page" spec, or move to its own FAQ-focused spec later if FAQ grows more coverage? Kept here for now since FAQ only appears on the home page today.
