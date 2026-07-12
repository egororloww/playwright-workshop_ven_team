import { test } from '@playwright/test'
import { runLighthouseAudit } from '../../playwright-utils/helpers/lighthouse'

// Scoped here (not in playwright.config.ts) so only these serialized Lighthouse tests bind the debugging port, not every parallel worker.
test.use({ launchOptions: { args: ['--remote-debugging-port=9222'] } })

const CARS_PAGE_THRESHOLDS = { performance: 55, accessibility: 65, 'best-practices': 90, seo: 75 }

test.describe('Admin Lighthouse audits', () => {
  // Perf checks measure a single navigation directly, so they goto() the page under test instead of clicking through from home.
  test('Cars page meets Lighthouse thresholds @lighthouse', async ({ page }) => {
    await page.goto('/cars')
    await runLighthouseAudit(page, CARS_PAGE_THRESHOLDS)
  })
})
