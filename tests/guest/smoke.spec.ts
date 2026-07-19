import { test, expect } from '../../playwright-utils/fixtures'

test.describe('Guest smoke', () => {
  test.beforeEach(async ({ pom }) => {
    await pom.homePage.open()
  })

  test('Home page loads', async ({ page }) => {
    await expect(page).toHaveURL('/')
  })
})
