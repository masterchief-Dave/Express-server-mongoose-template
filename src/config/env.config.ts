import { z } from "zod";

const EnvConfig = z.object({
  // CLOUDINARY_CLOUD_NAME: z.string().min(1),
  // CLOUDINARY_API_KEY: z.string().min(1),
  // CLOUDINARY_API_SECRET: z.string().min(1),
  // CLOUDINARY_UPLOAD_FOLDER: z.string().min(1).default("fixit"),
  // CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  APP_NAME: z.string().min(1),
  BREVO_EMAIL: z.email(),
  BREVO_PASSWORD: z.string().min(1),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.url().default("sqlite://./data.db"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_SECRET: z.string().min(10),
  MAIL_FROM: z.email().default("support@example.com"),
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("3000"),
  PRETTY_LOGS: z.string().default("true"),
  SUPPORT_EMAIL: z.email().default("realtor@example.com"),
});

export type Env = z.infer<typeof EnvConfig>;
export const env: Env = EnvConfig.parse(process.env);
