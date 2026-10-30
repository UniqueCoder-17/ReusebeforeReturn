/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_URL: string
  readonly VITE_DEFAULT_CITY: string
  readonly VITE_DEFAULT_STATE: string
  readonly VITE_DEFAULT_LAT: string
  readonly VITE_DEFAULT_LNG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
