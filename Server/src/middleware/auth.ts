import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: Missing token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env["JWT_SECRET"];

  if (!token || !secret) {
    res.status(401).json({ message: "Unauthorized: Invalid configuration" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Unauthorized: Invalid token payload" });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized: Token verification failed" });
  }
};
