/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PHONE: string;
  readonly VITE_APP_EMAIL: string;
  readonly VITE_APP_ADDRESS: string;
  readonly VITE_APP_INSTAGRAM: string;
  readonly VITE_APP_MAILCHIMP_URL: string;
  readonly VITE_APP_FACEBOOK: string;
  readonly VITE_APP_API: string;
  readonly VITE_APP_CARS_LIST_ENDPOINT: string;
  readonly VITE_APP_CARS_LIST_RANDOM_ENDPOINT: string;
  readonly VITE_APP_HEARTLAND_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
