import { test, expect } from '@playwright/test'
import { getPageLoadDuration } from '../../playwright-utils/helpers/performance'
import { seedBookingSession } from '../../playwright-utils/helpers/booking'

const PROFILE_PAGE_BUDGET_MS = 2000
const BOOKING_PAGE_BUDGET_MS = 2000
const TERMS_AND_CONDITIONS_PAGE_BUDGET_MS = 2000
const PAYMENT_PAGE_BUDGET_MS = 2000

test.describe('User performance', () => {
  // Perf checks measure a single navigation's timing directly, so they goto() the page under test instead of clicking through from home.
  test('Profile page loads within budget @performance', async ({ page }) => {
    await page.goto('/profile')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(PROFILE_PAGE_BUDGET_MS)
  })

  test('Booking page loads within budget @performance', async ({ page }) => {
    await seedBookingSession(page)
    await page.goto('/booking')
    await expect(page).toHaveURL('/booking')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(BOOKING_PAGE_BUDGET_MS)
  })

  test('Booking terms and conditions page loads within budget @performance', async ({ page }) => {
    await seedBookingSession(page)
    await page.goto('/booking/terms-and-conditions')
    await expect(page).toHaveURL('/booking/terms-and-conditions')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(TERMS_AND_CONDITIONS_PAGE_BUDGET_MS)
  })

  test('Booking payment page loads within budget @performance', async ({ page }) => {
    await seedBookingSession(page)
    await page.goto('/booking/payment')
    await expect(page).toHaveURL('/booking/payment')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(PAYMENT_PAGE_BUDGET_MS)
  })
})
