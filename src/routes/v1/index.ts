import express from "express";
import { authorRoutes } from "./authorRoutes";
import { authRoutes } from "./authRoutes";
import { bookRoutes } from "./bookRoutes";
import { ratingRoutes } from "./ratingRoutes";
import { reviewRoutes } from "./reviewRoutes";
import { userRoutes } from "./userRoutes";

export const v1Routes = express.Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/books", bookRoutes);
v1Routes.use("/authors", authorRoutes);
v1Routes.use("/users", userRoutes);
v1Routes.use("/reviews", reviewRoutes);
v1Routes.use("/ratings", ratingRoutes);

