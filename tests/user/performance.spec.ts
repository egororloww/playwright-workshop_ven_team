import { test, expect } from '../../playwright-utils/fixtures'

const PROFILE_PAGE_BUDGET_MS = 2000
const BOOKING_PAGE_BUDGET_MS = 2000
const TERMS_AND_CONDITIONS_PAGE_BUDGET_MS = 2000
const PAYMENT_PAGE_BUDGET_MS = 2000

test.describe('User performance', () => {
  test('Profile page loads within budget', async ({ pom }) => {
    const duration = await pom.profilePage.measureLoadDuration()
    expect(duration).toBeLessThan(PROFILE_PAGE_BUDGET_MS)
  })

  test('Booking page loads within budget', async ({ pom }) => {
    const duration = await pom.bookingPage.measureLoadDuration()
    expect(duration).toBeLessThan(BOOKING_PAGE_BUDGET_MS)
  })

  test('Booking terms and conditions page loads within budget', async ({ pom }) => {
    const duration = await pom.bookingTermsPage.measureLoadDuration()
    expect(duration).toBeLessThan(TERMS_AND_CONDITIONS_PAGE_BUDGET_MS)
  })

  test('Booking payment page loads within budget', async ({ pom }) => {
    const duration = await pom.paymentPage.measureLoadDuration()
    expect(duration).toBeLessThan(PAYMENT_PAGE_BUDGET_MS)
  })
})
