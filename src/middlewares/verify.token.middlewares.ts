import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { APIError } from "../utils/APIError";

// Extend the Request type to include user
interface CustomRequest extends Request {
  user?: any; // You can replace 'any' with a proper User type
}

export const verifyToken = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; // Assigning decoded token to req.user
    next();
  } catch (error) {
    throw new APIError(500, "Internal Server Error", error as any);
  }
});
