import { test, expect } from '../../playwright-utils/fixtures/adblock'

test.describe('Guest with adblocker enabled', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Home page loads and renders with an adblocker active', async ({ page }) => {
    await expect(page.locator('main').getByRole('button', { name: 'Book Now' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'Our TOP CARS' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'ELITE FLEET GROUP' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Why Us' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'FAQ' })).toBeVisible()
  })

  test('Guest can still navigate to Our Cars with adblocker active', async ({ page }) => {
    await page.getByRole('navigation').getByRole('link', { name: 'Our Cars' }).click()
    await expect(page).toHaveURL('/our-cars')
  })
})
