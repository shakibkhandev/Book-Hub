import express from "express";
import {
  verifyToken,
  verifyTokenWithAPI,
} from "../../middlewares/verify.token.middlewares";
import { apiKeyRoutes } from "./apiKeyRoutes";
import { authorRoutes } from "./authorRoutes";
import { authRoutes } from "./authRoutes";
import { bookRoutes } from "./bookRoutes";
import { ratingRoutes } from "./ratingRoutes";
import { reviewRoutes } from "./reviewRoutes";
import { userRoutes } from "./userRoutes";

export const v1Routes = express.Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/books", verifyTokenWithAPI, bookRoutes);
v1Routes.use("/authors", verifyTokenWithAPI, authorRoutes);
v1Routes.use("/users", verifyTokenWithAPI, userRoutes);
v1Routes.use("/reviews", verifyTokenWithAPI, reviewRoutes);
v1Routes.use("/ratings", verifyTokenWithAPI, ratingRoutes);
v1Routes.use("/apikey", verifyToken, apiKeyRoutes);
