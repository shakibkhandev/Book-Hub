import express from "express";
import {
  createReview,
  deleteReview,
  getReviewById,
  getReviews,
  updateReview,
} from "../../controllers/v1/reviewControllers";

export const reviewRoutes = express.Router();

reviewRoutes.post("/", createReview);
reviewRoutes.get("/", getReviews);
reviewRoutes.get("/:reviewId", getReviewById);
reviewRoutes.put("/:reviewId", updateReview);
reviewRoutes.delete("/:reviewId", deleteReview);
