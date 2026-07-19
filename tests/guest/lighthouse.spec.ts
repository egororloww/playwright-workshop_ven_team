import { test } from '../../playwright-utils/fixtures'

// Scoped here (not in playwright.config.ts) so only these serialized Lighthouse tests bind the debugging port, not every parallel worker.
test.use({ launchOptions: { args: ['--remote-debugging-port=9222'] } })

const HOME_PAGE_THRESHOLDS = { performance: 35, accessibility: 75, 'best-practices': 90, seo: 85 }
const OUR_CARS_PAGE_THRESHOLDS = { performance: 65, accessibility: 75, 'best-practices': 90, seo: 95 }

test.describe('Guest Lighthouse audits', () => {
  test('Home page meets Lighthouse thresholds @lighthouse', async ({ pom }) => {
    await pom.homePage.measureLighthouseThresholds(HOME_PAGE_THRESHOLDS)
  })

  test('Our Cars page meets Lighthouse thresholds @lighthouse', async ({ pom }) => {
    await pom.ourCarsPage.measureLighthouseThresholds(OUR_CARS_PAGE_THRESHOLDS)
  })
})
