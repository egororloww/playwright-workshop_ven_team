import { test, expect } from '@playwright/test'
import { getAdminAccessToken } from '../../playwright-utils/helpers/api'

test.describe('Bookings API', () => {
  test('Admin bookings list requires authentication', async ({ request }) => {
    const response = await request.get('/bookings/list/admin')
    expect(response.status()).toBe(401)
  })

  test('Admin can list bookings with a valid token', async ({ request }) => {
    const accessToken = await getAdminAccessToken(request)
    const response = await request.get('/bookings/list/admin', { headers: { Authorization: `Bearer ${accessToken}` } })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.bookings)).toBe(true)
  })
})
