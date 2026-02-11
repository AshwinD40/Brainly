const parsePort = (rawPort: string | undefined): number => {
  if (!rawPort || rawPort.trim().length === 0) {
    return 4000;
  }

  const parsed = Number(rawPort);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return parsed;
};

const parseCorsOrigins = (rawOrigins: string | undefined): string[] => {
  if (!rawOrigins || rawOrigins.trim().length === 0) {
    return [];
  }

  const origins = rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return Array.from(new Set(origins));
};

const getRequiredEnv = (key: "MONGODB_URI" | "JWT_SECRET"): string => {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};

export const ENV = {
  NODE_ENV: process.env["NODE_ENV"] ?? "development",
  PORT: parsePort(process.env["PORT"]),
  CORS_ORIGINS: parseCorsOrigins(process.env["CORS_ORIGINS"]),
  MONGODB_URI: getRequiredEnv("MONGODB_URI"),
  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
} as const;
