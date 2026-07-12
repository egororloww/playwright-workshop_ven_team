import { test, expect } from '@playwright/test'

test.describe('Admin auth guard', () => {
  test('Admin cannot view protected pages once the session is cleared', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible()
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })
})
