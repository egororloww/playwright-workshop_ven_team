import { type Page, expect } from '@playwright/test'

export class HomePage {
  constructor(private page: Page) {}

  async openBookingFormForFirstCar() {
    await this.page.locator('[aria-label="Open modal"]:visible').first().click()
    await expect(this.page.getByRole('heading', { name: 'Choose car' })).toBeVisible()
  }
}
