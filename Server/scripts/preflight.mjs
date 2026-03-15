import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(projectRoot, "..");

for (const envFile of [
  path.join(projectRoot, ".env"),
  path.join(workspaceRoot, ".env"),
]) {
  dotenv.config({ path: envFile, override: false });
}

if (!process.env.CLERK_PUBLISHABLE_KEY?.trim() && process.env.VITE_CLERK_PUBLISHABLE_KEY?.trim()) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY.trim();
}

const errors = [];
const warnings = [];

const nodeEnv = process.env.NODE_ENV ?? "development";
const validNodeEnvs = new Set(["development", "production", "test"]);
const isProduction = nodeEnv === "production";

const allowTestKeys = process.env.ALLOW_TEST_KEYS === "true";

if (!validNodeEnvs.has(nodeEnv)) {
  errors.push(
    `NODE_ENV must be one of development, production, test. Received "${nodeEnv}".`,
  );
}

if (!process.env.NODE_ENV) {
  warnings.push("NODE_ENV is not set. Runtime will default to development.");
}

const requireEnv = (key) => {
  const value = process.env[key]?.trim();
  if (!value) {
    errors.push(`${key} is required.`);
    return "";
  }
  return value;
};

const mongodbUri = requireEnv("MONGODB_URI");
const clerkPublishableKey = requireEnv("CLERK_PUBLISHABLE_KEY");
const clerkSecretKey = requireEnv("CLERK_SECRET_KEY");

if (mongodbUri) {
  if (!/^mongodb(\+srv)?:\/\//.test(mongodbUri)) {
    errors.push("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
  }

  if (/(dbname|<|>|your[_-]?database|your[_-]?cluster)/i.test(mongodbUri)) {
    errors.push("MONGODB_URI appears to be a placeholder value.");
  }
}

if (clerkPublishableKey) {
  if (!/^pk_(test|live)_/.test(clerkPublishableKey)) {
    warnings.push("CLERK_PUBLISHABLE_KEY does not match expected Clerk key format.");
  }

  if (isProduction && !allowTestKeys && !clerkPublishableKey.startsWith("pk_live_")) {
    errors.push(
      "Use a live Clerk publishable key (pk_live_) in production or set ALLOW_TEST_KEYS=true.",
    );
  }
}

if (clerkSecretKey) {
  if (!/^sk_(test|live)_/.test(clerkSecretKey)) {
    warnings.push("CLERK_SECRET_KEY does not match expected Clerk key format.");
  }

  if (isProduction && !allowTestKeys && !clerkSecretKey.startsWith("sk_live_")) {
    errors.push(
      "Use a live Clerk secret key (sk_live_) in production or set ALLOW_TEST_KEYS=true.",
    );
  }
}

if (isProduction && allowTestKeys) {
  warnings.push("Production is using Clerk test keys (ALLOW_TEST_KEYS=true).");
}

const rawPort = process.env.PORT?.trim();
if (rawPort) {
  const parsed = Number(rawPort);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    errors.push("PORT must be a positive integer when provided.");
  }
}

const rawCorsOrigins = process.env.CORS_ORIGINS?.trim() ?? "";
const corsOrigins = rawCorsOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (isProduction && corsOrigins.length === 0) {
  errors.push("CORS_ORIGINS is required in production.");
}

for (const origin of corsOrigins) {
  if (origin === "*") {
    errors.push("CORS_ORIGINS cannot include '*' for this API.");
    continue;
  }

  try {
    const parsed = new URL(origin);
    const hostname = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol.toLowerCase();

    if (protocol !== "http:" && protocol !== "https:") {
      errors.push(`CORS origin "${origin}" must use http or https.`);
    }

    if (isProduction && (hostname === "localhost" || hostname === "127.0.0.1")) {
      errors.push(`CORS origin "${origin}" is not allowed in production.`);
    }
  } catch {
    errors.push(`CORS origin "${origin}" is not a valid URL.`);
  }
}

if (!isProduction && corsOrigins.length === 0) {
  warnings.push("CORS_ORIGINS is empty. Only local defaults will be allowed.");
}

const distEntry = path.join(projectRoot, "dist", "index.js");
if (!fs.existsSync(distEntry)) {
  errors.push("Build artifact not found at dist/index.js. Run npm run build first.");
}

if (errors.length > 0) {
  console.error("Preflight failed:");
  for (const err of errors) {
    console.error(`- ${err}`);
  }

  if (warnings.length > 0) {
    console.error("Warnings:");
    for (const warning of warnings) {
      console.error(`- ${warning}`);
    }
  }

  process.exit(1);
}

console.log("Preflight checks passed.");
if (warnings.length > 0) {
  console.log("Warnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}