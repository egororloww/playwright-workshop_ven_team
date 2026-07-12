import { type Page, expect } from '@playwright/test'

export class BookingSummaryPage {
  constructor(private page: Page) {}

  async expectBookedCarSummaryVisible(carName: string) {
    await expect(this.page.getByRole('heading', { name: carName })).toBeVisible()
  }
}
