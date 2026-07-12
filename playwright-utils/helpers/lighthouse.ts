import type { Page } from '@playwright/test'
import { playAudit } from 'playwright-lighthouse'

const LIGHTHOUSE_PORT = 9222

type LighthouseThresholds = {
  performance: number
  accessibility: number
  'best-practices': number
  seo: number
}

export async function runLighthouseAudit(page: Page, thresholds: LighthouseThresholds): Promise<void> {
  // Lighthouse drives its own CDP navigation, which doesn't inherit Playwright's context-level httpCredentials, so Basic Auth must be passed to Lighthouse directly.
  const basicAuthHeader = process.env.BASIC_AUTH_USER
    ? { Authorization: `Basic ${Buffer.from(`${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASSWORD}`).toString('base64')}` }
    : undefined

  await playAudit({ page, thresholds, port: LIGHTHOUSE_PORT, opts: basicAuthHeader ? { extraHeaders: basicAuthHeader } : undefined })
}
