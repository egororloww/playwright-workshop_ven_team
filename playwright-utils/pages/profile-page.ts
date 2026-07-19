import type { Page } from '@playwright/test'
import { getPageLoadDuration } from '../helpers/performance'
import { runLighthouseAudit, type LighthouseThresholds } from '../helpers/lighthouse'

export class ProfilePage {
  constructor(private page: Page) {}

  // Perf checks measure a single navigation's timing directly, so they goto() the page under test instead of clicking through from another page.
  async measureLoadDuration(): Promise<number> {
    await this.page.goto('/profile')
    return getPageLoadDuration(this.page)
  }

  async measureLighthouseThresholds(thresholds: LighthouseThresholds): Promise<void> {
    await this.page.goto('/profile')
    await runLighthouseAudit(this.page, thresholds)
  }
}
