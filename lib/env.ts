import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string().url(),
  GOOGLE_CALENDAR_ID: z.string(),
  GOOGLE_REFRESH_TOKEN: z.string(),
  SESSION_SECRET: z.string(),
  EMAIL_FROM: z.string().email(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string()
});

export const env = envSchema.safeParse(process.env);

export function ensureEnv() {
  if (!env.success) {
    throw new Error(`Invalid environment variables: ${env.error.message}`);
  }

  return env.data;
}
