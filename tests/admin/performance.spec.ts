import { test, expect } from '../../playwright-utils/fixtures'

const CARS_PAGE_BUDGET_MS = 2000
const BOOKINGS_PAGE_BUDGET_MS = 2000

test.describe('Admin performance', () => {
  test('Cars page loads within budget', async ({ pom }) => {
    const duration = await pom.adminCarsPage.measureLoadDuration()
    expect(duration).toBeLessThan(CARS_PAGE_BUDGET_MS)
  })

  test('Bookings page loads within budget', async ({ pom }) => {
    const duration = await pom.adminBookingsPage.measureLoadDuration()
    expect(duration).toBeLessThan(BOOKINGS_PAGE_BUDGET_MS)
  })
})
