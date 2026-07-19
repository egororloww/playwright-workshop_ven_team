import { type Page, expect } from '@playwright/test'
import { getPageLoadDuration } from '../helpers/performance'
import { seedBookingSession } from '../helpers/booking'

export class BookingPage {
  constructor(private page: Page) {}

  // Perf checks measure a single navigation's timing directly, so they goto() the page under test instead of clicking through from another page.
  async measureLoadDuration(): Promise<number> {
    await seedBookingSession(this.page)
    await this.page.goto('/booking')
    await expect(this.page).toHaveURL('/booking')
    return getPageLoadDuration(this.page)
  }
}
