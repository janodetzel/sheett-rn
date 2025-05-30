import { z } from "zod";

const envSchema = z.object({
  EXPO_OS: z.string().min(1),
  NODE_ENV: z
    .union([
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("development"),
  EXPO_BASE_URL: z.string().min(1),

  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;
