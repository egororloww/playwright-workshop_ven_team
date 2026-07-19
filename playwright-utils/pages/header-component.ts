import { type Page, expect } from '@playwright/test'

export class HeaderComponent {
  constructor(private page: Page) {}

  async signInWithCredentials(email: string, password: string) {
    await this.page.getByRole('button', { name: 'Sign In' }).click()
    await this.page.getByPlaceholder('Email').fill(email)
    await this.page.getByPlaceholder('Password').fill(password)
    await this.page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(this.page.getByRole('button', { name: 'Sign In' })).toBeHidden()
    await expect(this.page.getByRole('button', { name: 'Account' })).toBeVisible()
  }

  async openOurCars() {
    await this.page.getByRole('navigation').getByRole('link', { name: 'Our Cars' }).click()
    await expect(this.page).toHaveURL('/our-cars')
  }
}
