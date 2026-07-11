import { type Page, expect } from '@playwright/test'

export class LoginPopupComponent {
  constructor(private page: Page) {}

  async loginWithCredentials(email: string, password: string) {
    await this.page.getByPlaceholder('Email').fill(email)
    await this.page.getByPlaceholder('Password').fill(password)
    await this.page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(this.page.getByRole('dialog')).not.toBeVisible()
  }
}
