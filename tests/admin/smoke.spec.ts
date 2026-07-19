import { test } from '../../playwright-utils/fixtures'

test.describe('Admin smoke', () => {
  test('Authenticated session is active', async ({ pom }) => {
    await pom.adminHomePage.open()
    await pom.adminHomePage.expectAdminPanelVisible()
  })
})
