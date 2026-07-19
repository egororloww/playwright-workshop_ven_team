import { test } from '../../playwright-utils/fixtures'

test.describe('Guest login', () => {
  test.beforeEach(async ({ pom }) => {
    await pom.homePage.open()
  })

  test('Guest can sign in with valid credentials', async ({ pom }) => {
    await pom.headerComponent.signInWithCredentials(process.env.USER_EMAIL!, process.env.USER_PASSWORD!)
  })
})
