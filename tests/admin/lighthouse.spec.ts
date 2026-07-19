import { test } from '../../playwright-utils/fixtures'

// Scoped here (not in playwright.config.ts) so only these serialized Lighthouse tests bind the debugging port, not every parallel worker.
test.use({ launchOptions: { args: ['--remote-debugging-port=9222'] } })

const CARS_PAGE_THRESHOLDS = { performance: 55, accessibility: 65, 'best-practices': 90, seo: 75 }

test.describe('Admin Lighthouse audits', () => {
  test('Cars page meets Lighthouse thresholds @lighthouse', async ({ pom }) => {
    await pom.adminCarsPage.measureLighthouseThresholds(CARS_PAGE_THRESHOLDS)
  })
})
