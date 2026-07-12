import type { Page } from '@playwright/test'

export async function seedBookingSession(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.setItem('booking', JSON.stringify({ additionalServices: [] }))
  })
}
