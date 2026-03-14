declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production" | "test";
      PORT?: string;
      CORS_ORIGINS?: string;
      MONGODB_URI?: string;
      CLERK_PUBLISHABLE_KEY?: string;
      CLERK_SECRET_KEY?: string;
      VITE_CLERK_PUBLISHABLE_KEY?: string;
    }
  }
}

export {};
