import { type APIRequestContext } from '@playwright/test'

export async function getAdminAccessToken(request: APIRequestContext): Promise<string> {
  const response = await request.post('/auth/admin/login', {
    data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
  })
  const body = await response.json()
  return body.accessToken
}
