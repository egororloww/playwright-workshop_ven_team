import http from 'k6/http'
import { check, sleep } from 'k6'

const API_BASE_URL = __ENV.API_BASE_URL
const ADMIN_EMAIL = __ENV.ADMIN_EMAIL
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD

export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
  },
}

export function setup() {
  const loginRes = http.post(`${API_BASE_URL}/auth/admin/login`, JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }), {
    headers: { 'Content-Type': 'application/json' },
  })
  check(loginRes, { 'admin login succeeded': (res) => res.status === 201 })
  return { adminToken: loginRes.json('accessToken') }
}

export default function (data) {
  const publicVehiclesRes = http.get(`${API_BASE_URL}/vehicles/platform`)
  check(publicVehiclesRes, { 'vehicles/platform status is 200': (res) => res.status === 200 })

  const rafflesRes = http.get(`${API_BASE_URL}/raffles/winners`)
  check(rafflesRes, { 'raffles/winners status is 200': (res) => res.status === 200 })

  const authHeaders = { headers: { Authorization: `Bearer ${data.adminToken}` } }

  const adminVehiclesRes = http.get(`${API_BASE_URL}/vehicles/admin`, authHeaders)
  check(adminVehiclesRes, { 'vehicles/admin status is 200': (res) => res.status === 200 })

  const adminBookingsRes = http.get(`${API_BASE_URL}/bookings/list/admin`, authHeaders)
  check(adminBookingsRes, { 'bookings/list/admin status is 200': (res) => res.status === 200 })

  sleep(1)
}
