import { test, expect } from '@playwright/test'
import { createTestVehicle, deleteVehicle, getAdminAccessToken } from '../../playwright-utils/helpers/api'

test.describe('Vehicles API', () => {
  test('Public vehicle listing returns available vehicles', async ({ request }) => {
    const response = await request.get('/vehicles/platform')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.vehicles)).toBe(true)
  })

  test('Public random vehicle listing returns vehicles', async ({ request }) => {
    const response = await request.get('/vehicles/platform/random')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.vehicles)).toBe(true)
  })

  test('Public vehicle availability listing returns vehicles', async ({ request }) => {
    const response = await request.get('/vehicles/platform/availability')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.vehicles)).toBe(true)
  })

  test('Public vehicle availability test endpoint returns vehicles', async ({ request }) => {
    const response = await request.get('/vehicles/platform/availability/test')
    expect(response.status()).toBe(200)
  })

  test('Public single vehicle detail endpoints return data for an existing vehicle', async ({ request }) => {
    const listResponse = await request.get('/vehicles/platform')
    const vehicleId = (await listResponse.json()).vehicles[0].id

    const detailResponse = await request.get(`/vehicles/${vehicleId}/platform`)
    expect(detailResponse.status()).toBe(200)

    const availabilityResponse = await request.get(`/vehicles/${vehicleId}/platform/availability`)
    expect(availabilityResponse.status()).toBe(200)

    const parametersResponse = await request.get(`/vehicles/${vehicleId}/platform/parameters`)
    expect(parametersResponse.status()).toBe(200)

    const shortResponse = await request.get(`/vehicles/${vehicleId}/platform/short`)
    expect(shortResponse.status()).toBe(200)
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

  test('Admin can create, read, update, and delete a vehicle', async ({ request }) => {
    const adminToken = await getAdminAccessToken(request)
    const authHeader = { Authorization: `Bearer ${adminToken}` }

    const vehicleId = await createTestVehicle(request, adminToken)

    const getResponse = await request.get(`/vehicles/${vehicleId}/admin`, { headers: authHeader })
    expect(getResponse.status()).toBe(200)

    const updateResponse = await request.put(`/vehicles/${vehicleId}`, {
      headers: authHeader,
      multipart: { price: '150' },
    })
    expect(updateResponse.status()).toBe(200)

    const availabilityScheduleResponse = await request.get(`/vehicles/${vehicleId}/admin/availability/schedule`, { headers: authHeader })
    expect(availabilityScheduleResponse.status()).toBe(200)

    const deleteResponse = await request.delete(`/vehicles/${vehicleId}`, { headers: authHeader })
    expect(deleteResponse.status()).toBe(200)
  })

  test('Vehicle creation requires authentication', async ({ request }) => {
    const response = await request.post('/vehicles', {
      multipart: { make: 'Unauthorized', model: 'Attempt', price: '1', seats: '2', doors: '2', ageLimit: '21', fuelType: 'gasoline', description: 'should be rejected' },
    })
    expect(response.status()).toBe(401)
  })

  test('Admin can create and delete vehicle unavailable hours', async ({ request }) => {
    const adminToken = await getAdminAccessToken(request)
    const authHeader = { Authorization: `Bearer ${adminToken}` }
    const vehicleId = await createTestVehicle(request, adminToken)
    const unavailableFrom = '2027-01-01T00:00:00.000Z'
    const unavailableTo = '2027-01-02T00:00:00.000Z'

    const createResponse = await request.post('/vehiclesUnavailableHours', {
      headers: authHeader,
      data: { vehicleId, unavailableFrom, unavailableTo, comment: 'playwright test' },
    })
    expect(createResponse.status()).toBe(201)

    const listByVehicleResponse = await request.get(`/vehiclesUnavailableHours/vehicle/${vehicleId}`, { headers: authHeader })
    expect(listByVehicleResponse.status()).toBe(200)
    const unavailableHoursId = (await listByVehicleResponse.json()).vehiclesUnavailableHours[0].id

    const getByIdResponse = await request.get(`/vehiclesUnavailableHours/${unavailableHoursId}`, { headers: authHeader })
    expect(getByIdResponse.status()).toBe(200)

    const updateResponse = await request.put(`/vehiclesUnavailableHours/${unavailableHoursId}`, {
      headers: authHeader,
      data: { vehicleId, unavailableFrom, unavailableTo, comment: 'updated by playwright' },
    })
    expect(updateResponse.status()).toBe(200)

    const deleteResponse = await request.delete(`/vehiclesUnavailableHours/${unavailableHoursId}`, { headers: authHeader })
    expect(deleteResponse.status()).toBe(200)

    await deleteVehicle(request, adminToken, vehicleId)
  })

  test('Admin can list vehicle features', async ({ request }) => {
    const adminToken = await getAdminAccessToken(request)
    const authHeader = { Authorization: `Bearer ${adminToken}` }

    const listResponse = await request.get('/vehiclesFeatures/admin', { headers: authHeader })
    expect(listResponse.status()).toBe(200)
    const featureId = (await listResponse.json()).vehicles[0].id

    const getByIdResponse = await request.get(`/vehiclesFeatures/${featureId}/admin`, { headers: authHeader })
    expect(getByIdResponse.status()).toBe(200)
  })

  test('Vehicle gallery mutations require authentication', async ({ request }) => {
    const createResponse = await request.post('/vehiclesGallery', {
      multipart: { vehicleId: '1' },
    })
    expect(createResponse.status()).toBe(401)

    const updateResponse = await request.put('/vehiclesGallery/1', {
      multipart: { vehicleId: '1' },
    })
    expect(updateResponse.status()).toBe(401)

    const deleteResponse = await request.delete('/vehiclesGallery', {
      data: { ids: [1] },
    })
    expect(deleteResponse.status()).toBe(401)
  })
})
