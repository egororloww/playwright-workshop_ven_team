import { test, expect } from '@playwright/test'

test.describe('Guest login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Guest can sign in with valid credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.getByPlaceholder('Email').fill(process.env.USER_EMAIL!)
    await page.getByPlaceholder('Password').fill(process.env.USER_PASSWORD!)
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Account' })).toBeVisible()
  })
})
