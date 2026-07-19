import { test } from '../../playwright-utils/fixtures'

test.describe('User smoke', () => {
  test('Authenticated session is active', async ({ pom }) => {
    await pom.homePage.open()
    // TODO: replace with a real authenticated-only assertion
    // (e.g. expect(page.getByRole('button', { name: '<user menu>' })).toBeVisible())
  })
})
