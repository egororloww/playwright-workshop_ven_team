import { test } from '@playwright/test'
import { runLighthouseAudit } from '../../playwright-utils/helpers/lighthouse'

// Scoped here (not in playwright.config.ts) so only these serialized Lighthouse tests bind the debugging port, not every parallel worker.
test.use({ launchOptions: { args: ['--remote-debugging-port=9222'] } })

const PROFILE_PAGE_THRESHOLDS = { performance: 35, accessibility: 65, 'best-practices': 90, seo: 75 }

test.describe('User Lighthouse audits', () => {
  // Perf checks measure a single navigation directly, so they goto() the page under test instead of clicking through from home.
  test('Profile page meets Lighthouse thresholds @lighthouse', async ({ page }) => {
    await page.goto('/profile')
    await runLighthouseAudit(page, PROFILE_PAGE_THRESHOLDS)
  })
})
