import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import "dotenv/config";
import cors, { type CorsOptions } from "cors";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/database.js";
import { configureDNS } from "./config/dns.js";

import userRoutes from "./routes/user.js";
import contentRoutes from "./routes/content.js";
import brainRoutes from "./routes/brain.js";

const app = express();

const allowedOrigins =
  ENV.CORS_ORIGINS.length > 0
    ? ENV.CORS_ORIGINS
    : ["http://localhost:5173", "http://127.0.0.1:5173"];

const isLocalDevOrigin = (origin: string): boolean => {
  if (ENV.NODE_ENV === "production") {
    return false;
  }

  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true, // Changed to true to allow cookies/headers if needed
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Welcome to Brainly API",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "ok",
  });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/brain", brainRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof Error && error.message.startsWith("CORS blocked")) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Unhandled server error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  },
);

const startServer = async (): Promise<void> => {
  try {
    configureDNS();
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
      console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
