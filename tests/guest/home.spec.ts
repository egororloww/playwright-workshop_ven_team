import { test, expect } from '@playwright/test'

test.describe('Guest home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Guest sees the home page hero and all key sections', async ({ page }) => {
    await expect(page.locator('main').getByRole('button', { name: 'Book Now' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'Our TOP CARS' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'ELITE FLEET GROUP' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Why Us' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'FAQ' })).toBeVisible()
  })
})
