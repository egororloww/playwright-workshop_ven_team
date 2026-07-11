import { test, expect } from '@playwright/test'

test.describe('Admin smoke', () => {
  test('Authenticated session is active', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible()
  })
})
