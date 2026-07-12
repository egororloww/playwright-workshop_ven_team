import { type APIRequestContext } from '@playwright/test'

export async function getAdminAccessToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/auth/admin/login', {
    data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
  })
  const body = await response.json()
  return body.accessToken
}

export async function getUserAccessToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/auth/login', {
    data: { email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD },
  })
  const body = await response.json()
  return body.accessToken
}

function decodeJwtId(token: string): number {
  const payload = token.split('.')[1]
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())
  return decoded.id
}

export async function registerTempCustomer(request: APIRequestContext): Promise<{ email: string; password: string; accessToken: string; userId: number }> {
  const email = `pw-temp-${Date.now()}-${Math.floor(Math.random() * 10000)}@example.com`
  const password = 'TempPass123!'
  const response = await request.post('/auth/register', {
    multipart: {
      email,
      firstName: 'Playwright',
      lastName: 'TempUser',
      phoneNumber: '+15550001234',
      password,
    },
  })
  const body = await response.json()
  return { email, password, accessToken: body.accessToken, userId: decodeJwtId(body.accessToken) }
}

export async function deleteUser(request: APIRequestContext, adminToken: string, userId: number): Promise<void> {
  await request.delete(`/users/${userId}/admin`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
}

export async function createTestVehicle(request: APIRequestContext, adminToken: string): Promise<number> {
  const response = await request.post('/vehicles', {
    headers: { Authorization: `Bearer ${adminToken}` },
    multipart: {
      make: 'PlaywrightTestMake',
      model: 'PlaywrightTestModel',
      price: '99',
      seats: '4',
      doors: '4',
      ageLimit: '21',
      fuelType: 'gasoline',
      description: 'Created by Playwright API test, safe to delete',
    },
  })
  const body = await response.json()
  return body.vehicles.id
}

export async function deleteVehicle(request: APIRequestContext, adminToken: string, vehicleId: number): Promise<void> {
  await request.delete(`/vehicles/${vehicleId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  })
}
