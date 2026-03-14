import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "../..");
const workspaceRoot = path.resolve(serverRoot, "..");

const envFiles = [
  path.join(serverRoot, ".env"),
  path.join(workspaceRoot, ".env"),
];

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile, override: false });
  }
}

const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY?.trim();
const viteClerkPublishableKey = process.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();

if (!clerkPublishableKey && viteClerkPublishableKey) {
  process.env.CLERK_PUBLISHABLE_KEY = viteClerkPublishableKey;
}
