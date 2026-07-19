import { test } from '../../playwright-utils/fixtures'

// Scoped here (not in playwright.config.ts) so only these serialized Lighthouse tests bind the debugging port, not every parallel worker.
test.use({ launchOptions: { args: ['--remote-debugging-port=9222'] } })

const PROFILE_PAGE_THRESHOLDS = { performance: 35, accessibility: 65, 'best-practices': 90, seo: 75 }

test.describe('User Lighthouse audits', () => {
  test('Profile page meets Lighthouse thresholds @lighthouse', async ({ pom }) => {
    await pom.profilePage.measureLighthouseThresholds(PROFILE_PAGE_THRESHOLDS)
  })
})
