# Coverage Plan: Elite Fleet Group — Full-App Exploratory Coverage

**Actor:** Guest (unauthenticated), User (authenticated customer), Admin
**Feature area:** Entire app — guest-facing site (platform-fe) + admin panel (admin-panel)
**Primary goal:** Establish real E2E coverage across every major flow; today only placeholder smoke tests exist (guest home loads, admin heading visible, user stub with a TODO).
**Suggested files:** new spec files per area under `tests/guest/`, `tests/user/`, `tests/admin/` (see per-area sections)
**Existing related tests:** `tests/guest/smoke.spec.ts` (home loads), `tests/user/smoke.spec.ts` (stub, no real assertion), `tests/admin/smoke.spec.ts` (heading visible) — none of these cover any feature behavior.

## Assumptions
- No POM/PageManager exists yet (`playwright-utils/pages/`, `page-manager.ts` are not built) despite being the documented convention in `.claude/rules/playwright-architecture.md`. Building it out is a prerequisite for writing these tests properly — flagged per-area below where it matters most (auth, booking, admin CRUD).
- Payment step uses a third-party hosted-fields SDK (Heartland/Global Payments) — real card entry can't be driven normally in E2E without a sandbox test-card mode. Flagged as an open question.
- Admin has no sub-roles (single `isAuthenticated` flag) — no role-based access-control matrix needed within admin.
- `sessionStorage`/`localStorage` state (registration draft, booking draft, tokens) must be cleared between independent tests to avoid cross-test leakage — noted per relevant case.

---

## Area 1 — Guest: Static Pages & Navigation
**Suggested file:** `tests/guest/navigation.spec.ts` (new)

### Happy path
1. **Guest can navigate to all public pages from the header/footer** — visits Our Cars, About Us, FAQ, Privacy Policy, Terms & Conditions via nav links _(P0)_
   - Pre: unauthenticated, start at `/`
   - Steps: click each header/footer nav link in turn
   - Expect: URL and page heading match target page for each
2. **Guest sees FAQ accordion expand/collapse** — clicking a question reveals its answer _(P1)_
3. **Guest can reach Winners page via direct URL** (nav link is commented out, unreachable via UI otherwise) _(P2)_

### Edge cases
4. **Guest hitting an unknown URL sees NotFound page** _(P1)_
   - Steps: navigate to a nonsense path
   - Expect: NotFound content rendered, not a crash

### Negative cases
5. **Guest hitting a route error (e.g. malformed detail id) sees ErrorPage boundary**, not a blank screen _(P2)_

### Out of scope
- Newsletter Mailchimp subscribe — covered in Area 2 if a dedicated component is confirmed rendered on Landing.

---

## Area 2 — Guest: Login / Register / Forgot Password
**Suggested file:** `tests/guest/auth.spec.ts` (new). Requires POM: `LoginPage`/`AuthPopup` component object + `pom` fixture bootstrap.

### Happy path
1. **Guest can log in with valid credentials** — opens Sign In popup, submits, sees authenticated header (UserMenu) _(P0)_
   - Pre: unauth, valid `USER_EMAIL`/`USER_PASSWORD`
   - Steps: click "Sign In" → fill Email/Password → submit
   - Expect: popup closes, header shows UserMenu instead of Sign In
2. **Guest can complete forgot-password flow end to end** (email → code → new password) _(P1)_ — needs a way to retrieve the emailed code; may be out of scope for pure E2E without email/test hook (flag as open question)
3. **Guest can register a new account inline during booking** (see Area 3 — registration is embedded in the booking flow, not a standalone page)

### Edge cases
4. **Login popup: "Forgot your password?" toggles into forgot-password step and "Back" returns to login** _(P1)_
5. **Resend code button on CodeStep is disabled during 20s countdown** _(P2)_

### Negative cases
6. **Guest sees generic "Incorrect email or password" on both fields for wrong credentials** _(P0)_
7. **Guest sees "User with this email does not exist" when requesting reset for unregistered email** _(P1)_ — note: this is a user-enumeration leak, worth flagging even though it's testable
8. **Guest sees "Incorrect verification code" for a wrong code on CodeStep** _(P1)_
9. **Empty/malformed email or password shows field-level validation errors before submit is attempted** _(P1)_

### Out of scope
- Real password-reset email retrieval (no test mailbox integration known) — mark as open question.

### Open questions
- Is there a test mailbox / API hook to retrieve the reset-password code for full E2E coverage of forgot-password?

---

## Area 3 — Guest/User: Car Browsing & Booking Drawer
**Suggested file:** `tests/guest/cars.spec.ts` (browsing, guest-accessible) + `tests/user/booking-drawer.spec.ts` (booking creation)

### Happy path
1. **Guest can browse Our Cars and open a car's detail page** — sees hero image, gallery, features, description matching the listing _(P0)_
2. **Guest/User can open the booking drawer from any page via "Book Now" and fill valid dates/vehicle/locations** — sees live price breakdown update _(P0)_
   - Steps: click Book Now → set pickup/return dates ≥1hr from now with ≥30min gap → pick vehicle → pick pickup/return locations → check price breakdown
   - Expect: total updates as selections change; "Book Now" submit navigates to `/booking`
3. **"Same as Pick-up" checkbox syncs return location to pickup location and disables the return select** _(P1)_

### Edge cases
4. **Booking drawer state persists across a page refresh** (sessionStorage.prebooking) _(P1)_
5. **Selecting a vehicle marked unavailable disables the "Book Now" submit** _(P1)_
6. **Pickup date less than 1 hour from now is rejected** _(P1)_
7. **Return date before pickup date, or gap under 30 minutes, is rejected** _(P1)_

### Negative cases
8. **Submitting the drawer with any required field empty shows validation errors and does not navigate** _(P1)_
9. **Directly navigating to `/booking` without going through the drawer redirects to `/`** (no `sessionStorage.booking`) _(P0)_

### Out of scope
- Additional services flat-fee vs per-day price computation exactness — arguably a unit-test concern for the pricing formula; only spot-check the total changes, not exact math, in E2E.

---

## Area 4 — User: Booking Flow (Driver Info → Terms → Payment → Success)
**Suggested file:** `tests/user/booking-flow.spec.ts` (new)

### Happy path
1. **Authenticated user with existing profile proceeds through driver info (read-only profile view) → terms → payment → success** _(P0)_
2. **Guest completes registration as step 1 of booking (new account), then proceeds through terms/payment** _(P0)_
   - Steps: fill firstName/lastName/email/phone/password/confirmPassword (docs optional) → submit → agree to terms → complete payment
   - Expect: account created, booking created, lands on SuccessPayment page showing "Booking #{id} is successfully created"

### Edge cases
10. **Registration form auto-saves to sessionStorage and restores on remount** (navigate away mid-fill and back) _(P2)_
11. **Uploading a driver-license file over 10MB is rejected**; wrong file type (e.g. `.txt`) is rejected _(P1)_
12. **User with unverified phone is prompted to verify phone before continuing past driver info** _(P1)_
13. **Direct navigation to `/booking/terms-and-conditions` or `/booking/payment` while unauthenticated redirects/blocks (PrivateRoute)** _(P0)_

### Negative cases
14. **Registration with an email already in use shows "Email address already in use"** _(P0)_
15. **Registration with mismatched password/confirmPassword shows validation error, blocks submit** _(P1)_
16. **Payment with invalid/declined card shows the generic payment-failure message** _(P1)_ — depends on sandbox test-card support (open question)
17. **Payment submitted with missing zip/street address is blocked client-side** _(P1)_

### Out of scope
- Exact Heartland/Global Payments hosted-iframe interaction — flagged as an open question; may require `frameLocator` + SDK test mode, possibly not fully E2E-testable without sandbox credentials.

### Open questions
- Does the test environment have Heartland/Global Payments sandbox test-card numbers available for scripted payment success/decline?

---

## Area 5 — User: My Bookings & Booking Details
**Suggested file:** `tests/user/bookings.spec.ts` (new)

### Happy path
1. **User can view My Bookings list and open a booking's details** _(P0)_
2. **User can cancel an upcoming, cancelable booking they own** _(P0)_
   - Steps: open booking details for own future, non-terminal-status booking → click Cancel → confirm in modal
   - Expect: status updates, list/detail reflect cancellation
3. **My Bookings list infinite-scrolls to load more entries beyond the first batch of 5** _(P1)_

### Edge cases
4. **Empty state**: user with zero bookings sees "You haven't made any bookings yet" + a "Book a car" CTA that opens the drawer _(P1)_
5. **Cancel button is hidden for bookings in terminal status** (canceled/completed/declined) or with a past pickup date _(P1)_

### Negative cases
6. **Guest (unauthenticated) viewing a booking-details URL directly does not see Cancel/"Back to My Bookings"** (public page, ownership-gated actions) _(P1)_
7. **User viewing another user's booking-details URl does not see the Cancel action** (not their booking) _(P1)_ — need a second test account or a known foreign booking id
8. **Direct navigation to `/booking/list` while unauthenticated is blocked (PrivateRoute)** _(P0)_

### Open questions
- Is there a second test user account (or known booking ID belonging to someone else) to validate the not-owner case?

---

## Area 6 — User: Profile & Change Password
**Suggested file:** `tests/user/profile.spec.ts` (new)

### Happy path
1. **User can view their profile** (name/email/phone/documents) _(P0)_
2. **User can edit profile fields and save successfully** _(P0)_
3. **User can change their password successfully** _(P0)_

### Edge cases
4. **Editing profile and clicking Cancel discards changes, returns to view without saving** _(P1)_
5. **User can remove and re-upload a document on the edit page** _(P2)_

### Negative cases
6. **Changing to a new password identical to the old one shows "New password must be different from current password"** _(P1)_
7. **Change-password with wrong old password shows "Incorrect password"** _(P0)_
8. **Editing profile with an email already used by another account shows "Email address already in use"** _(P1)_
9. **Direct navigation to `/profile` or `/profile/edit` while unauthenticated is blocked (PrivateRoute)** _(P0)_

---

## Area 7 — Admin: Login & Access Control
**Suggested file:** `tests/admin/auth.spec.ts` (new)

### Happy path
1. **Admin can log in with valid credentials and lands on Cars list** _(P0)_ (already implicitly covered by `auth.setup.ts`, but no standalone spec exists — consider a dedicated login-flow test independent of the storageState shortcut)

### Negative cases
2. **Admin login with wrong credentials shows a generic credentials error on both fields** _(P0)_
3. **Unauthenticated direct navigation to any admin route (e.g. `/bookings/42`) renders the Login form in place, URL unchanged** _(P0)_ — notable app quirk: no redirect, just content swap
4. **After logging in from a deep, originally-unauthenticated URL, admin lands on default `/cars` rather than the originally requested page** _(P2)_ — confirms the known no-redirect-back gap

---

## Area 8 — Admin: Cars CRUD
**Suggested file:** `tests/admin/cars.spec.ts` (new). Requires POM for the two-step car form.

### Happy path
1. **Admin can view the Cars list** with expected columns _(P0)_
2. **Admin can create a new car** through both form steps (details + gallery images) _(P0)_
   - Steps: Add Car → fill make/model/price/doors/seats/fuelType/ageLimit/description/features/listing images → submit → add gallery images → save
   - Expect: navigates to the new car's detail page, fields match input
3. **Admin can edit an existing car's fields** (only dirty fields submitted) _(P1)_
4. **Admin can delete a car with no active bookings** _(P0)_

### Edge cases
5. **Editing a car with no changes (nothing dirty) skips the update call and still proceeds to gallery step** _(P2)_
6. **Car form submit stays disabled until all required fields are valid** _(P1)_
7. **Uploading an oversized or wrong-type listing image is rejected** (normalImage/hoverImage ≤100KB, mainImage ≤2MB, jpg/jpeg/png only) _(P1)_
8. **Admin can add and remove gallery images before saving** _(P2)_

### Negative cases
9. **Deleting a car with active bookings shows the toast** "The vehicle has active bookings. Please finalize the bookings first." and does not delete _(P0)_

---

## Area 9 — Admin: Car Availability Calendar
**Suggested file:** `tests/admin/car-availability.spec.ts` (new)

### Happy path
1. **Admin can set an unavailable-time block for a car** (from/to/comment) and see it appear on the day calendar and in the table below _(P0)_
2. **Admin can delete an unavailable-time entry via confirm dialog** _(P0)_
3. **Clicking a "booking" event on the day calendar opens the booking details side drawer with a link to the full booking page** _(P1)_
4. **Navigating months on the datepicker highlights dates that have unavailable/booked events** _(P1)_

### Edge cases
5. **Unavailable-time form rejects `unavailableTo` earlier than or equal to `unavailableFrom`** _(P1)_
6. **Overlapping unavailable-time ranges surface the server-provided conflict error via toast** _(P1)_
7. **"Buffer time" events on the calendar are shown but not clickable** _(P2)_

---

## Area 10 — Admin: Bookings Management
**Suggested file:** `tests/admin/bookings.spec.ts` (new)

### Happy path
1. **Admin can view the Bookings list and open a booking's detail page** with all sections (general/documents/services/delivery/payment) _(P0)_
2. **Admin can accept a `new` booking** (direct action, no confirm) _(P0)_
3. **Admin can complete an `accepted` booking** (direct action, no confirm) _(P1)_
4. **Admin can decline a booking via confirm modal** _(P0)_

### Edge cases
5. **Actions menu is hidden entirely for bookings in terminal status** (completed/declined/canceled) _(P1)_
6. **Booking detail links to the linked car's and customer's detail pages correctly** (cross-page content linking — verify the car/customer shown matches the one linked) _(P1)_

---

## Area 11 — Admin: Customers (read-only)
**Suggested file:** `tests/admin/customers.spec.ts` (new)

### Happy path
1. **Admin can view the Customers list** with expected columns _(P0)_
2. **Admin can open a customer's detail page and switch between General and Bookings tabs** _(P0)_
3. **Customer's Bookings tab shows only that customer's bookings, each linking correctly to `/bookings/:id`** _(P1)_

### Out of scope
- No create/edit/delete exists for customers — nothing to test there.

---

## Area 12 — Admin: Raffle
**Suggested file:** `tests/admin/raffle.spec.ts` (new)

### Happy path
1. **Admin can view the Raffle winners list** _(P1)_
2. **Admin can select/generate a new raffle winner**, who then appears in the list _(P0)_

### Edge cases
3. **"Select Winner" is disabled while the request is pending** _(P2)_

### Negative cases
4. **When all participants have already won, an inline error is shown instead of a toast, and the button remains functionally blocked** _(P1)_ — may require seeded data to reach this state; flag as open question if not reproducible in the test env.

### Open questions
- Is there a way to seed/reset raffle participant state in the test environment to reliably hit the "all already won" case?

---

## Cross-Cutting Prerequisite: POM Bootstrap
Almost every area above needs page objects that don't exist yet. Recommended build order (highest reuse first):
1. `playwright-utils/fixtures/page-manager.ts` + `pom` fixture in `fixtures/index.ts`
2. `HeaderComponent` / `AuthPopup` (guest) — used by nearly every guest/user test for login
3. `BookingDrawer`, `DriverInformationPage`, `PaymentPage` — the core money-path flow
4. Admin: `LoginPage`, `CarsListPage`/`CarFormPage`, `BookingsListPage`/`BookingDetailPage`
5. Remaining lower-traffic areas (Customers, Raffle, static pages) as simple page objects

## Global Open Questions
- Test mailbox/API hook for forgot-password code retrieval?
- Payment sandbox test-card numbers for Heartland/Global Payments?
- Second test user account for "not-owner" negative cases on bookings?
- Way to seed/reset raffle state for the "all already won" case?
