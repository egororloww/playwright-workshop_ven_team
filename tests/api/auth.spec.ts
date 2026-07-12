import { test, expect } from '@playwright/test'
import { deleteUser, getAdminAccessToken, registerTempCustomer } from '../../playwright-utils/helpers/api'

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

  test('Customer can log in with valid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD },
    })
    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.accessToken).toBeTruthy()
    expect(body.refreshToken).toBeTruthy()
  })

  test('Customer can refresh an access token and log out', async ({ request }) => {
    const loginResponse = await request.post('/auth/login', {
      data: { email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD },
    })
    const loginBody = await loginResponse.json()

    const refreshResponse = await request.post('/auth/refresh', {
      data: { refreshToken: loginBody.refreshToken },
    })
    expect(refreshResponse.status()).toBe(201)
    const refreshBody = await refreshResponse.json()
    expect(refreshBody.accessToken).toBeTruthy()

    const logoutResponse = await request.post('/auth/logout', {
      headers: { Authorization: `Bearer ${loginBody.accessToken}` },
    })
    expect(logoutResponse.status()).toBe(201)
  })

  test('New customer can register and the account is retrievable by admin', async ({ request }) => {
    const tempCustomer = await registerTempCustomer(request)
    const adminToken = await getAdminAccessToken(request)

    const response = await request.get(`/users/${tempCustomer.userId}/customer/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(response.status()).toBe(200)

    await deleteUser(request, adminToken, tempCustomer.userId)
  })

  test('Password reset request is accepted for an existing email', async ({ request }) => {
    const response = await request.post('/auth/resetPassword', {
      data: { email: process.env.USER_EMAIL },
    })
    expect(response.status()).toBe(201)
  })

  test('Password reset code verification is rejected for an invalid code', async ({ request }) => {
    const response = await request.post('/auth/resetPassword/code/verify', {
      data: { code: '000000' },
    })
    expect(response.status()).toBe(404)
  })

  test('Password reset confirmation is rejected for an invalid code', async ({ request }) => {
    const response = await request.post('/auth/resetPassword/confirm', {
      data: { code: '000000', password: 'DoesNotMatter123!' },
    })
    expect(response.status()).toBe(404)
  })
})
