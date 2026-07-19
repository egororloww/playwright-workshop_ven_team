import { test } from '../../playwright-utils/fixtures'

test.describe('Guest home page', () => {
  test.beforeEach(async ({ pom }) => {
    await pom.homePage.open()
  })

  test('Guest sees the home page hero and all key sections', async ({ pom }) => {
    await pom.homePage.expectHeroAndKeySectionsVisible()
  })
})
