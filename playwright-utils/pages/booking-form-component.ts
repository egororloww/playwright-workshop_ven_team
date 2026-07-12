import { type Page, expect } from '@playwright/test'

export class BookingFormComponent {
  constructor(private page: Page) {}

  async bookAvailableCarWithService(serviceName: string) {
    await this.page.getByRole('textbox').first().click()
    await this.page.getByRole('listbox', { name: /^month/ }).getByRole('option', { selected: false, disabled: false }).first().click()

    await this.page.locator('.react-select__control:visible').first().click()
    const availableCarOption = this.page.getByRole('option', { disabled: false }).first()
    await expect(availableCarOption).toBeVisible()
    const carOptionTextValue = await availableCarOption.textContent()
    const carNameValue = carOptionTextValue!.split('$')[0].trim()
    await availableCarOption.click()

    await this.page.getByRole('heading', { name: new RegExp(`^${serviceName}`) }).first().click()
    await this.page.locator('#booking-form-section').getByRole('button', { name: 'Book Now', exact: true }).click()
    await expect(this.page).toHaveURL('/booking')

    return carNameValue
  }
}
