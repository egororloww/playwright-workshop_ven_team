import { test as setup } from '@playwright/test'

const userFile = 'playwright-utils/.auth/user.json'
const adminFile = 'playwright-utils/.auth/admin.json'

setup('authenticate as user', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.getByPlaceholder('Email').fill(process.env.USER_EMAIL!)
  await page.getByPlaceholder('Password').fill(process.env.USER_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.getByPlaceholder('Email').waitFor({ state: 'hidden' })
  await page.context().storageState({ path: userFile })
})

setup('authenticate as admin', async ({ page }) => {
  await page.goto(process.env.ADMIN_BASE_URL!)
  await page.getByPlaceholder('Email').fill(process.env.ADMIN_EMAIL!)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD!)
  await page.getByRole('button', { name: 'Sign In', exact: true }).click()
  await page.waitForURL('**/cars')
  await page.context().storageState({ path: adminFile })
})
