import { test, expect } from '@playwright/test'
import { getPageLoadDuration } from '../../playwright-utils/helpers/performance'
import { seedBookingSession } from '../../playwright-utils/helpers/booking'

const HOME_PAGE_BUDGET_MS = 2000
const OUR_CARS_PAGE_BUDGET_MS = 2000
const ABOUT_US_PAGE_BUDGET_MS = 2000
const BOOKING_PAGE_BUDGET_MS = 2000

test.describe('Guest performance', () => {
  // Perf checks measure a single navigation's timing directly, so they goto() the page under test instead of clicking through from home.
  test('Home page loads within budget @performance', async ({ page }) => {
    await page.goto('/')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(HOME_PAGE_BUDGET_MS)
  })

  test('Our Cars page loads within budget @performance', async ({ page }) => {
    await page.goto('/our-cars')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(OUR_CARS_PAGE_BUDGET_MS)
  })

  test('About Us page loads within budget @performance', async ({ page }) => {
    await page.goto('/about-us')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(ABOUT_US_PAGE_BUDGET_MS)
  })

  test('Booking page loads within budget @performance', async ({ page }) => {
    await seedBookingSession(page)
    await page.goto('/booking')
    await expect(page).toHaveURL('/booking')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(BOOKING_PAGE_BUDGET_MS)
  })
})
