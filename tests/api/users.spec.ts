import { test, expect } from '@playwright/test'
import { deleteUser, getAdminAccessToken, getUserAccessToken, registerTempCustomer } from '../../playwright-utils/helpers/api'

test.describe('Users API', () => {
  test('Admin customer list requires authentication', async ({ request }) => {
    const response = await request.get('/users/customer/list/admin')
    expect(response.status()).toBe(401)
  })

  test('Admin can list customers with a valid token', async ({ request }) => {
    const accessToken = await getAdminAccessToken(request)
    const response = await request.get('/users/customer/list/admin', { headers: { Authorization: `Bearer ${accessToken}` } })
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.users)).toBe(true)
  })

  test('Admin can view a specific customer', async ({ request }) => {
    const adminToken = await getAdminAccessToken(request)
    const authHeader = { Authorization: `Bearer ${adminToken}` }
    const listResponse = await request.get('/users/customer/list/admin', { headers: authHeader })
    const customerId = (await listResponse.json()).users[0].id

    const response = await request.get(`/users/${customerId}/customer/admin`, { headers: authHeader })
    expect(response.status()).toBe(200)
  })

  test('Customer profile endpoints require authentication', async ({ request }) => {
    const profileResponse = await request.get('/users/profile/customer')
    expect(profileResponse.status()).toBe(401)

    const bookingResponse = await request.get('/users/profile/customer/booking')
    expect(bookingResponse.status()).toBe(401)
  })

  test('User can view their own profile and bookings', async ({ request }) => {
    const accessToken = await getUserAccessToken(request)
    const authHeader = { Authorization: `Bearer ${accessToken}` }

    const profileResponse = await request.get('/users/profile/customer', { headers: authHeader })
    expect(profileResponse.status()).toBe(200)

    const bookingResponse = await request.get('/users/profile/customer/booking', { headers: authHeader })
    expect(bookingResponse.status()).toBe(200)
  })

  test('User can update their profile', async ({ request }) => {
    const tempCustomer = await registerTempCustomer(request)
    const authHeader = { Authorization: `Bearer ${tempCustomer.accessToken}` }

    const response = await request.put('/users/profile', {
      headers: authHeader,
      multipart: {
        email: tempCustomer.email,
        firstName: 'PlaywrightUpdated',
        lastName: 'TempUserUpdated',
        phoneNumber: '+15550009999',
      },
    })
    expect(response.status()).toBe(200)

    const adminToken = await getAdminAccessToken(request)
    await deleteUser(request, adminToken, tempCustomer.userId)
  })

  test('User can update their password and log in with the new one', async ({ request }) => {
    const tempCustomer = await registerTempCustomer(request)
    const authHeader = { Authorization: `Bearer ${tempCustomer.accessToken}` }
    const newPassword = 'TempPassUpdated456!'

    const updateResponse = await request.put('/users/password', {
      headers: authHeader,
      data: { oldPassword: tempCustomer.password, newPassword },
    })
    expect(updateResponse.status()).toBe(200)

    const loginResponse = await request.post('/auth/login', {
      data: { email: tempCustomer.email, password: newPassword },
    })
    expect(loginResponse.status()).toBe(201)

    const adminToken = await getAdminAccessToken(request)
    await deleteUser(request, adminToken, tempCustomer.userId)
  })

  test('Phone verification endpoints require authentication', async ({ request }) => {
    const sendResponse = await request.post('/users/send/phone/verification')
    expect(sendResponse.status()).toBe(401)

    const checkResponse = await request.post('/users/check/phone/verification', { data: { code: '000000' } })
    expect(checkResponse.status()).toBe(401)
  })

  test('User can request a phone verification code', async ({ request }) => {
    const tempCustomer = await registerTempCustomer(request)
    const authHeader = { Authorization: `Bearer ${tempCustomer.accessToken}` }

    const response = await request.post('/users/send/phone/verification', { headers: authHeader })
    expect(response.status()).toBe(201)

    const adminToken = await getAdminAccessToken(request)
    await deleteUser(request, adminToken, tempCustomer.userId)
  })

  test('Admin can delete a customer account', async ({ request }) => {
    const tempCustomer = await registerTempCustomer(request)
    const adminToken = await getAdminAccessToken(request)
    const authHeader = { Authorization: `Bearer ${adminToken}` }

    const deleteResponse = await request.delete(`/users/${tempCustomer.userId}/admin`, { headers: authHeader })
    expect(deleteResponse.status()).toBe(200)

    const getResponse = await request.get(`/users/${tempCustomer.userId}/customer/admin`, { headers: authHeader })
    expect(getResponse.status()).not.toBe(200)
  })

  test('Deleting a customer account requires authentication', async ({ request }) => {
    const response = await request.delete('/users/1/admin')
    expect(response.status()).toBe(401)
  })

  test('Profile image update requires authentication', async ({ request }) => {
    const response = await request.put('/users/profile/images', {
      multipart: { isRemoveDriverLicenseImage1: 'false' },
    })
    expect(response.status()).toBe(401)
  })
})
