import { test } from '../../playwright-utils/fixtures'

test.describe('Guest auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Guest can log in with valid credentials', async ({ pom }) => {
    await pom.headerComponent.openSignIn()
    await pom.loginPopupComponent.loginWithCredentials(process.env.USER_EMAIL!, process.env.USER_PASSWORD!)
    await pom.headerComponent.expectUserIsAuthenticated()
  })
})
