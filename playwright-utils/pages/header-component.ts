import { type Page, expect } from '@playwright/test'

export class HeaderComponent {
  constructor(private page: Page) {}

  async openSignIn() {
    await this.page.getByRole('button', { name: 'Sign In' }).click()
    await expect(this.page.getByRole('dialog')).toBeVisible()
  }

  async expectUserIsAuthenticated() {
    await expect(this.page.getByRole('button', { name: 'Account' })).toBeVisible()
  }
}
