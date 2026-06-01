import "server-only";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const supabase = {
  url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  serviceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
} as const;

export const gemini = {
  apiKeys: [
    requireEnv("GEMINI_API_KEY_1"),
    requireEnv("GEMINI_API_KEY_2"),
    requireEnv("GEMINI_API_KEY_3"),
    requireEnv("GEMINI_API_KEY_4"),
    requireEnv("GEMINI_API_KEY_5"),
    requireEnv("GEMINI_API_KEY_6"),
    requireEnv("GEMINI_API_KEY_7"),
  ],
} as const;

export const app = {
  env: optionalEnv("NEXTJS_ENV", "production"),
  name: "itadz",
} as const;
