import { test, expect } from '@playwright/test'

test.describe('Auth API', () => {
  test('Admin can log in with valid credentials', async ({ request }) => {
    const response = await request.post('/auth/admin/login', {
      data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
    })
    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.accessToken).toBeTruthy()
    expect(body.refreshToken).toBeTruthy()
  })

  test('Admin login is rejected with invalid credentials', async ({ request }) => {
    const response = await request.post('/auth/admin/login', {
      data: { email: process.env.ADMIN_EMAIL, password: 'wrong-password' },
    })
    expect(response.status()).toBe(401)
  })
})
