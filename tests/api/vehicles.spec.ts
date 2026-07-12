import { test, expect } from '@playwright/test'
import { getAdminAccessToken } from '../../playwright-utils/helpers/api'

test.describe('Vehicles API', () => {
  test('Public vehicle listing returns available vehicles', async ({ request }) => {
    const response = await request.get('/vehicles/platform')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.vehicles)).toBe(true)
  })

  test('Admin vehicle listing requires authentication', async ({ request }) => {
    const response = await request.get('/vehicles/admin')
    expect(response.status()).toBe(401)
  })

  test('Admin can list vehicles with a valid token', async ({ request }) => {
    const accessToken = await getAdminAccessToken(request)
    const response = await request.get('/vehicles/admin', { headers: { Authorization: `Bearer ${accessToken}` } })
    expect(response.status()).toBe(200)
  })
})
