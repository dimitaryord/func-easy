/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_ANON_KEY: string
  readonly PUBLIC_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
