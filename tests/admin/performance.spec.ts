import { test, expect } from '@playwright/test'
import { getPageLoadDuration } from '../../playwright-utils/helpers/performance'

const CARS_PAGE_BUDGET_MS = 2000
const BOOKINGS_PAGE_BUDGET_MS = 2000

test.describe('Admin performance', () => {
  // Perf checks measure a single navigation's timing directly, so they goto() the page under test instead of clicking through from home.
  test('Cars page loads within budget @performance', async ({ page }) => {
    await page.goto('/cars')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(CARS_PAGE_BUDGET_MS)
  })

  test('Bookings page loads within budget @performance', async ({ page }) => {
    await page.goto('/bookings')
    const duration = await getPageLoadDuration(page)
    expect(duration).toBeLessThan(BOOKINGS_PAGE_BUDGET_MS)
  })
})
