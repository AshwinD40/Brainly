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

const errors = [];
const warnings = [];

const nodeEnv = process.env.NODE_ENV ?? "development";
const validNodeEnvs = new Set(["development", "production", "test"]);

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
const jwtSecret = requireEnv("JWT_SECRET");

if (mongodbUri) {
  if (!/^mongodb(\+srv)?:\/\//.test(mongodbUri)) {
    errors.push("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
  }

  if (/(dbname|<|>|your[_-]?database|your[_-]?cluster)/i.test(mongodbUri)) {
    errors.push("MONGODB_URI appears to be a placeholder value.");
  }
}

if (jwtSecret && jwtSecret.length < 6) {
  warnings.push("JWT_SECRET is short. A strong secret of at least 16 characters is recommended.");
}

const rawPort = process.env.PORT?.trim();
if (rawPort) {
  const parsed = Number(rawPort);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    errors.push("PORT must be a positive integer when provided.");
  }
}

if (warnings.length > 0) {
  console.warn("\nPreflight Warnings:");
  for (const warning of warnings) {
    console.warn(` - ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("\nPreflight Validation Failed:");
  for (const error of errors) {
    console.error(` - ${error}`);
  }
  process.exit(1);
}

console.log("Preflight checks passed cleanly!");