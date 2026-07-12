import { devices } from '@playwright/test'
import { test, expect } from '../../playwright-utils/fixtures'

test.use({ ...devices['Pixel 7'] })

test.describe('Guest booking on mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Guest can book a car with an additional service', async ({ pom }) => {
    await pom.homePage.openBookingFormForFirstCar()
    const carNameValue = await pom.bookingFormComponent.bookAvailableCarWithService('Unlimited miles')
    await pom.bookingSummaryPage.expectBookedCarSummaryVisible(carNameValue)
  })
})
