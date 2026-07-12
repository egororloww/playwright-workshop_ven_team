export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST_ENV?: 'local'
      BASE_URL?: string
      CI?: string
      BASIC_AUTH_USER?: string
      BASIC_AUTH_PASSWORD?: string
      USER_EMAIL?: string
      USER_PASSWORD?: string
      ADMIN_BASE_URL?: string
      ADMIN_EMAIL?: string
      ADMIN_PASSWORD?: string
      API_BASE_URL?: string
    }
  }
}
