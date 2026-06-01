import type { Fetcher } from "@cloudflare/workers-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      GEMINI_API_KEY_1: string;
      GEMINI_API_KEY_2: string;
      GEMINI_API_KEY_3: string;
      GEMINI_API_KEY_4: string;
      GEMINI_API_KEY_5: string;
      GEMINI_API_KEY_6: string;
      GEMINI_API_KEY_7: string;
    }
  }
}

export interface CloudflareEnv {
  ASSETS: Fetcher;
  IMAGES: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  DOCUMENT_GENERATOR: Fetcher;
  NEXT_INC_CACHE_R2_BUCKET?: R2Bucket;
}
