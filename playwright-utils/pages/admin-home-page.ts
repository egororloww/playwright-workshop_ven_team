import { type Page, expect } from '@playwright/test'

export class AdminHomePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/')
  }

  async clearSessionAndReload() {
    await this.page.evaluate(() => localStorage.clear())
    await this.page.reload()
  }

  async expectAdminPanelVisible() {
    await expect(this.page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible()
  }

  async expectSignInHeadingVisible() {
    await expect(this.page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  }
}
