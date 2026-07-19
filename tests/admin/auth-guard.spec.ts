import { test } from '../../playwright-utils/fixtures'

test.describe('Admin auth guard', () => {
  test('Admin cannot view protected pages once the session is cleared', async ({ pom }) => {
    await pom.adminHomePage.open()
    await pom.adminHomePage.expectAdminPanelVisible()
    await pom.adminHomePage.clearSessionAndReload()
    await pom.adminHomePage.expectSignInHeadingVisible()
  })
})
