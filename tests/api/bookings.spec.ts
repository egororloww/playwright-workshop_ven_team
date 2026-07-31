import { test, expect } from '@playwright/test'
import { getAdminAccessToken, getUserAccessToken } from '../../playwright-utils/helpers/api'

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

  test('User bookings list requires authentication', async ({ request }) => {
    const response = await request.get('/bookings/list/platform')
    expect(response.status()).toBe(401)
  })

  test('User can list their own bookings with a valid token', async ({ request }) => {
    const accessToken = await getUserAccessToken(request)
    const response = await request.get('/bookings/list/platform', { headers: { Authorization: `Bearer ${accessToken}` } })
    expect(response.status()).toBe(200)
  })

  test('Admin can view a booking by id', async ({ request }) => {
    const adminToken = await getAdminAccessToken(request)
    const authHeader = { Authorization: `Bearer ${adminToken}` }
    const listResponse = await request.get('/bookings/list/admin', { headers: authHeader })
    const bookingId = (await listResponse.json()).bookings[0].id

    const response = await request.get(`/bookings/${bookingId}/admin`, { headers: authHeader })
    expect(response.status()).toBe(200)
  })

  test('Admin can view bookings for a specific customer', async ({ request }) => {
    const adminToken = await getAdminAccessToken(request)
    const authHeader = { Authorization: `Bearer ${adminToken}` }
    const customersResponse = await request.get('/users/customer/list/admin', { headers: authHeader })
    const customerId = (await customersResponse.json()).users[0].id

    const response = await request.get(`/bookings/list/customer/${customerId}/admin`, { headers: authHeader })
    expect(response.status()).toBe(200)
  })

  test('Public single booking endpoint returns data for an existing booking', async ({ request }) => {
    const adminToken = await getAdminAccessToken(request)
    const listResponse = await request.get('/bookings/list/admin', { headers: { Authorization: `Bearer ${adminToken}` } })
    const bookingId = (await listResponse.json()).bookings[0].id

    const response = await request.get(`/bookings/${bookingId}/platform`)
    expect(response.status()).toBe(200)
  })
})
