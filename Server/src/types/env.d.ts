declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "test";
      PORT?: string;
      CORS_ORIGINS?: string;
      MONGODB_URI?: string;
      JWT_SECRET?: string;
    }
  }
}

export { };
