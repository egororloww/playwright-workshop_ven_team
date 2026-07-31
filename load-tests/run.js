const { spawnSync } = require('child_process')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', `.env.test.${process.env.TEST_ENV ?? 'local'}`), quiet: true })

const result = spawnSync('k6', ['run', path.resolve(__dirname, 'api-read.k6.js')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    API_BASE_URL: process.env.API_BASE_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
})

process.exit(result.status ?? 1)
