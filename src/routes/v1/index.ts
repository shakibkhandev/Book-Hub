import express from "express";
import { authRoutes } from "./authRoutes";

export const v1Routes = express.Router();


v1Routes.use("/auth", authRoutes)
