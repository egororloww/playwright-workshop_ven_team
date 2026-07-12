import type { Page } from '@playwright/test'

export async function getPageLoadDuration(page: Page): Promise<number> {
  return page.evaluate(() => {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    return entry.loadEventEnd - entry.startTime
  })
}
