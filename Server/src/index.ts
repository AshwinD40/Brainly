import "./config/loadEnv.js";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { configureDNS } from "./config/dns.js";
import { clerkMiddleware } from "./middleware/auth.js";
import brainRouter from "./routes/brain.js";
import contentRouter from "./routes/content.js";

const app = express();
const PORT = process.env.PORT ?? 4000;
const isProduction = process.env.NODE_ENV === "production";
const origins = (
  process.env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? []
);

const isLocalDevOrigin = (origin: string): boolean => {
  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (origins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (!isProduction && isLocalDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(clerkMiddleware());

app.use("/api/v1/content", contentRouter);
app.use("/api/v1/brain", brainRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  void next;
  console.error(err);

  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(500).json({
    message: isProduction ? "Internal Server Error" : message,
  });
};

app.use(errorHandler);

configureDNS();

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
