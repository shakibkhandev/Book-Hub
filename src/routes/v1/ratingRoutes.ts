import express from "express";
import {
  createRating,
  deleteRating,
  getRatingByRatingId,
  getRatingsByBookId,
  updateRating,
} from "../../controllers/v1/ratingControllers";

export const ratingRoutes = express.Router();

ratingRoutes.post("/", createRating);
ratingRoutes.get("/", getRatingsByBookId);
ratingRoutes.get("/:ratingId", getRatingByRatingId);
ratingRoutes.put("/:ratingId", updateRating);
ratingRoutes.delete("/:ratingId", deleteRating);
