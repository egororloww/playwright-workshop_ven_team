import { test as base, type Page } from '@playwright/test'
import { PlaywrightBlocker } from '@ghostery/adblocker-playwright'
import fetch from 'cross-fetch'

type AdblockFixtures = {
  page: Page
}

export const test = base.extend<AdblockFixtures>({
  page: async ({ page }, use) => {
    const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch)
    await blocker.enableBlockingInPage(page)
    await use(page)
  },
})

export { expect } from '@playwright/test'
