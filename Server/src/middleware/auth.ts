import { type NextFunction, type Request, type RequestHandler, type Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env.js";

interface AuthPayload extends JwtPayload {
  userId: string;
}

export const auth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        success: false,
        message: "No authorization header"
      });
    }

    const token = header.startsWith("Bearer ")
      ? header.slice(7)
      : header;

    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    req.userId = (decoded as AuthPayload).userId;
    return next();
  } catch (err: unknown) {
    console.error("Auth error:", err);

    if (err instanceof Error) {
      return res.status(401).json({
        success: false,
        message: err.message || "Invalid token"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

};
