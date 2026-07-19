import type { Page } from '@playwright/test'
import { getPageLoadDuration } from '../helpers/performance'

export class AboutUsPage {
  constructor(private page: Page) {}

  // Perf checks measure a single navigation's timing directly, so they goto() the page under test instead of clicking through from another page.
  async measureLoadDuration(): Promise<number> {
    await this.page.goto('/about-us')
    return getPageLoadDuration(this.page)
  }
}
