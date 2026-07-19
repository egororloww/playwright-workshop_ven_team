import { test, expect } from '../../playwright-utils/fixtures'

const HOME_PAGE_BUDGET_MS = 2000
const OUR_CARS_PAGE_BUDGET_MS = 2000
const ABOUT_US_PAGE_BUDGET_MS = 2000
const BOOKING_PAGE_BUDGET_MS = 2000

test.describe('Guest performance', () => {
  test('Home page loads within budget', async ({ pom }) => {
    const duration = await pom.homePage.measureLoadDuration()
    expect(duration).toBeLessThan(HOME_PAGE_BUDGET_MS)
  })

  test('Our Cars page loads within budget', async ({ pom }) => {
    const duration = await pom.ourCarsPage.measureLoadDuration()
    expect(duration).toBeLessThan(OUR_CARS_PAGE_BUDGET_MS)
  })

  test('About Us page loads within budget', async ({ pom }) => {
    const duration = await pom.aboutUsPage.measureLoadDuration()
    expect(duration).toBeLessThan(ABOUT_US_PAGE_BUDGET_MS)
  })

  test('Booking page loads within budget', async ({ pom }) => {
    const duration = await pom.bookingPage.measureLoadDuration()
    expect(duration).toBeLessThan(BOOKING_PAGE_BUDGET_MS)
  })
})
