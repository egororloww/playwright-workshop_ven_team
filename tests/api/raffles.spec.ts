import { test, expect } from '@playwright/test'

test.describe('Raffles API', () => {
  test('Public raffle winners endpoint returns a list', async ({ request }) => {
    const response = await request.get('/raffles/winners')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.raffles)).toBe(true)
  })
})
