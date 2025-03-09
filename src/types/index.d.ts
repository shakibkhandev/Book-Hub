import { Request } from "express";

interface CustomRequest extends Request {
    user?: any; // You can replace 'any' with a proper User type
  }