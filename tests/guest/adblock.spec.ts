import { test } from '../../playwright-utils/fixtures/adblock'

test.describe('Guest with adblocker enabled', () => {
  test.beforeEach(async ({ pom }) => {
    await pom.homePage.open()
  })

  test('Home page loads and renders with an adblocker active', async ({ pom }) => {
    await pom.homePage.expectHeroAndKeySectionsVisible()
  })

  test('Guest can still navigate to Our Cars with adblocker active', async ({ pom }) => {
    await pom.headerComponent.openOurCars()
  })
})
