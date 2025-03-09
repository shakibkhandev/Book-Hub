import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { CustomRequest } from "../types";
import { APIError } from "../utils/APIError";
import { asyncHandler } from "../utils/asyncHandler";

// Extend the Request type to include user

export const verifyToken = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }

      console.log(decoded);
      
      req.user = decoded; // Assigning decoded token to req.user
      next();
    } catch (error) {
      throw new APIError(500, "Internal Server Error", error as any);
    }
  }
);

export const verifyTokenWithAPI = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1];
    const apikey = req.headers.book_hub_api_key;

    
    if (!token || !apikey) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded; // Assigning decoded token to req.user

      // Additional API-specific checks can be added here
      // For example, checking if the user has a specific role or if they have access to a specific API endpoint
      // ...

      const existingApiKey = await prisma.apiKey.findUnique({
        where: {
          apiKey: apikey as string,
          ownerId: (typeof decoded !== "string"
            ? decoded.id
            : undefined) as string,
          isExpired: false,
        },
      });
      if (!existingApiKey) {
        return res.status(401).json({ message: "Invalid API Key" });
      }

      await prisma.apiKey.update({
        where: {
          apiKey: existingApiKey.apiKey,
        },
        data: {
          // Add the fields you want to update here
          lastUsedAt: new Date(),
          remainingRequests: existingApiKey.remainingRequests - 1,
          usedRequests: existingApiKey.usedRequests + 1,
          isExpired:
            existingApiKey.totalRequests == existingApiKey.usedRequests + 1,
        },
      });

      next();
    } catch (error) {
      throw new APIError(500, "Internal Server Error", error as any);
    }
  }
);
