# Coverage Plan: Guest Login & "Book Now" Flow (Guest + Authenticated User)

**Actor:** Guest (unauthenticated visitor) and Authenticated User
**Feature area:** Auth (Sign In modal) and Booking (multi-step booking journey)
**Primary goal:** A guest can sign in successfully or see correct errors; a guest or signed-in user can complete a car booking from the header "Book Now" entry point through to reaching the payment/success step, with each step's validation rules enforced.
**Suggested files:**
- `tests/guest/login.spec.ts` (new)
- `tests/guest/booking.spec.ts` (new)
- `tests/user/booking.spec.ts` (new)
- New page objects in `playwright-utils/pages/`: `header-component.ts`, `auth-popup.ts` (or `login-page.ts`), `booking-form-page.ts`, `driver-information-page.ts`, `terms-and-conditions-page.ts`, `payment-page.ts`
- New `playwright-utils/fixtures/page-manager.ts` (currently `playwright-utils/fixtures/index.ts` is empty — POM infra needs to be bootstrapped, likely via `pw-refactor-into-pom` or built fresh when writing tests)

**Existing related tests:** none (only `Guest smoke > Home page loads`, `User/Admin smoke > Authenticated session is active` placeholders)

## Assumptions
- "Book Now" is reached via the header button (`platform-fe/src/components/layouts/RootLayout/Header/index.tsx:82-84`) on the home page, per the project rule that tests always start at `/`.
- Payment page tests validate reaching the page and its visible state/validation only — no real payment gateway interaction (out of scope for E2E without a sandboxed processor).
- Available cars/locations/services are dynamic (loaded from API) — tests select "the first available option" rather than hardcoding a specific car/location name, since the plan can't assume fixed seed data.
- "Same as Pick-up" checkbox behavior is testable via UI (syncing return location).
- Guest booking necessarily flows through the embedded registration form at Driver Info — this is unavoidable to reach later booking steps as a guest, so it's exercised there, but its own field-level negative cases (password mismatch, duplicate email, malformed file upload, etc.) are marked out of scope per the "Sign In modal only" login-scope decision.

## Test cases

### Happy path

1. **Guest can sign in with valid credentials** — guest opens Sign In modal from header and logs in successfully _(P0)_
   - Pre: unauthenticated, valid `USER_EMAIL`/`USER_PASSWORD` from env
   - Steps: go to `/` → click "Sign In" → fill email + password → submit
   - Expect: modal closes, header reflects authenticated state (e.g. "Sign In" replaced by account/logout affordance)

2. **Guest can complete the booking flow through to payment** — guest starts a booking, registers as a new driver, and reaches the payment step _(P0)_
   - Pre: unauthenticated; a not-yet-registered email for the registration step
   - Steps: go to `/` → click "Book Now" → select pick-up date, return date, car, pick-up location, return location → submit booking form → fill registration form (name, email, password, phone, upload license x2, insurance docs) → submit → accept Terms & Conditions → proceed
   - Expect: user lands on `/booking/payment` (or payment page content is visible); user is now authenticated (tokens set); each step's data persists to the next (e.g. selected car/dates reflected in summary)

3. **Signed-in user can complete the booking flow through to payment** — authenticated user starts a booking and reaches payment without re-registering _(P0)_
   - Pre: `user` storage state (authenticated)
   - Steps: go to `/` → click "Book Now" → select dates, car, pick-up/return locations → submit booking form → on Driver Info, profile view is shown pre-filled (no registration form) → confirm/continue → accept Terms & Conditions → proceed
   - Expect: Driver Info step shows `ProfileBookingView` (pre-filled), not `RegistrationForm`; user lands on payment step

4. **Return location defaults to pick-up location via "Same as Pick-up"** — variant of the happy path exercising the sync checkbox _(P1)_
   - Pre: guest or user, mid booking-form fill
   - Steps: select pick-up location → check "Same as Pick-up"
   - Expect: return location field auto-populates/matches pick-up location and becomes non-editable or synced

5. **Guest can add optional additional services to a booking** — happy path variant with add-ons _(P1)_
   - Pre: guest, mid booking-form fill
   - Steps: select dates, car, locations → check one or more additional services (e.g. prepaid fuel, insurance) → observe price breakdown → submit
   - Expect: price summary reflects added services (per-day or flat fee); booking proceeds to Driver Info with services retained

### Edge cases

6. **Pick-up date exactly at the 1-hour minimum boundary is accepted** — boundary test for `pickupDate` validation _(P1)_
   - Pre: any actor, on booking form
   - Steps: set pick-up date/time to exactly current time + 1 hour
   - Expect: no validation error; form proceeds

7. **Return date exactly 30 minutes after pick-up is accepted** — boundary test for `returnDate` validation _(P1)_
   - Pre: any actor, valid pick-up date already set
   - Steps: set return date to pick-up date + exactly 30 minutes
   - Expect: no validation error; form proceeds

8. **Refreshing mid-booking-flow preserves progress via sessionStorage** — navigation edge _(P1)_
   - Pre: guest or user, has submitted the booking form (booking data saved to `sessionStorage`) and is on Driver Info
   - Steps: refresh the page
   - Expect: booking data persists (page does not redirect to `/` since `sessionStorage.booking` still exists); form/profile view still shows correct state

9. **Navigating directly to `/booking` without prior booking-form submission redirects home** — state boundary _(P1)_
   - Pre: guest or user, no `booking` key in sessionStorage
   - Steps: navigate directly to `/booking`
   - Expect: redirected to `/`

10. **Guest's registration form data survives navigating back from a later step** — navigation edge, partial-entry recovery _(P2)_
    - Pre: guest, has partially filled registration form (non-file fields) and navigated away then back
    - Steps: fill first/last name + email → navigate back (browser back) → return to Driver Info
    - Expect: previously entered non-sensitive fields (not password, not documents) are pre-filled from sessionStorage

11. **Double-submitting the booking form does not create duplicate navigation/state** — concurrency edge _(P2, testable via UI)_
    - Pre: any actor, booking form fully valid
    - Steps: rapidly double-click "Submit"/"Continue"
    - Expect: only a single navigation to Driver Info occurs; no duplicate/erroneous state

### Negative cases

12. **Guest sees error for invalid credentials on Sign In** — auth negative path _(P0)_
    - Pre: unauthenticated
    - Steps: go to `/` → open Sign In → fill a valid-format but wrong email/password combo → submit
    - Expect: inline error "Incorrect email or password"; modal stays open; not authenticated

13. **Sign In shows required-field errors when submitted empty** — validation negative _(P1)_
    - Pre: unauthenticated, Sign In modal open
    - Steps: submit with both fields empty
    - Expect: "Email is required" and "Password is required" shown inline

14. **Sign In shows format error for malformed email** — validation negative _(P1)_
    - Pre: unauthenticated, Sign In modal open
    - Steps: fill email with invalid format (e.g. `notanemail`), valid password → submit
    - Expect: "Email is not valid" shown inline; not authenticated

15. **Booking form blocks submission with a past pick-up date** — validation negative _(P1)_
    - Pre: any actor, on booking form
    - Steps: attempt to set pick-up date in the past (or leave defaulted invalid state) and submit
    - Expect: "Trip starts in the past" (or "Trip can start at least 1 hour from now") shown; form does not proceed

16. **Booking form blocks return date before/too-close-to pick-up date** — validation negative _(P1)_
    - Pre: any actor, valid pick-up date set
    - Steps: set return date earlier than pick-up + 30 min → submit
    - Expect: "Return date must be greater than Pick-up date" shown; form does not proceed

17. **Booking form blocks submission with required fields missing** — validation negative _(P1)_
    - Pre: any actor, on booking form
    - Steps: leave car, pick-up location, or return location unselected → submit
    - Expect: field-level required errors shown; form does not proceed

18. **Unauthenticated user hitting a private booking route directly is redirected** — authorization negative _(P0)_
    - Pre: unauthenticated (guest), no auth storage state
    - Steps: navigate directly to `/booking/terms-and-conditions` or `/booking/payment` without going through the flow
    - Expect: redirected away (per `PrivateRoute` guard) — likely to `/` or a login prompt, not the protected page content

19. **Car becomes unavailable / no cars for selected dates** — external-state negative, only if UI-observable _(P2, `?`)_
    - Pre: any actor, on booking form with dates selected that yield no available cars
    - Steps: select a date range with no available inventory (if reproducible without backend mocking)
    - Expect: car dropdown shows disabled/empty state or a "no cars available" message

## Out of scope
- Guest registration form's own field-level negative cases (password complexity mismatch, duplicate email "Email address already in use", invalid file type/size for license/insurance uploads) — user explicitly scoped login coverage to the Sign In modal only; these belong to a future dedicated registration-flow plan.
- Forgot Password flow — separate modal/flow, not part of the Sign In or booking scenarios given.
- Actual payment capture/success (real charge, third-party payment gateway behavior) — plan validates reaching/rendering the payment step, not payment processing itself.
- Admin-side booking management — out of scope for this guest/user-focused plan.
- Two-tabs-parallel booking concurrency — not reliably testable through UI without backend coordination.

## Open questions
- Q19 (car/location unavailability) — confirm there's a reproducible way to hit "no availability" without mocking the API (e.g. a known far-future date range), or drop it.
- Confirm whether "Book Now" navigates to a dedicated `/booking` step-1 view or opens an in-page drawer/modal on `/` — exploration notes both "opens a drawer" and "Navigation Path: `/booking`"; this should be verified when writing the first test since it affects whether the booking form itself is page 1 of `/booking` or a component on the home page.
- Confirm the exact post-login header state change (e.g. avatar/name vs. a "Logout" button) to write a precise assertion for case 1.
