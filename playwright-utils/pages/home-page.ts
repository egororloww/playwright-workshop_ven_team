import { type Page, expect } from '@playwright/test'
import { getPageLoadDuration } from '../helpers/performance'
import { runLighthouseAudit, type LighthouseThresholds } from '../helpers/lighthouse'

export class HomePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/')
    await expect(this.page).toHaveURL('/')
  }

  // Perf checks measure a single navigation's timing directly, so they goto() the page under test instead of clicking through from another page.
  async measureLoadDuration(): Promise<number> {
    await this.page.goto('/')
    return getPageLoadDuration(this.page)
  }

  async measureLighthouseThresholds(thresholds: LighthouseThresholds): Promise<void> {
    await this.page.goto('/')
    await runLighthouseAudit(this.page, thresholds)
  }

  async expectHeroAndKeySectionsVisible() {
    await expect(this.page.locator('main').getByRole('button', { name: 'Book Now' })).toBeVisible()
    await expect(this.page.getByRole('heading', { level: 1, name: 'Our TOP CARS' })).toBeVisible()
    await expect(this.page.getByRole('heading', { level: 2, name: 'ELITE FLEET GROUP' })).toBeVisible()
    await expect(this.page.getByRole('heading', { level: 2, name: 'Why Us' })).toBeVisible()
    await expect(this.page.getByRole('heading', { level: 2, name: 'FAQ' })).toBeVisible()
  }
}
