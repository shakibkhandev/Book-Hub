import { Response } from "express";
import { prisma } from "../../db";
import { CustomRequest } from "../../types";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const createReview = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { bookId, review } = req.body;
    const userId = req.user.id;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res
        .status(404)
        .json(new ApiResponse(404, undefined, "Book not found"));
    }

    const newReview = await prisma.review.create({
      data: {
        bookId,
        userId,
        review,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, newReview, "Review created successfully"));
  }
);

export const getReviews = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const bookId = req.query.bookId as string;

    const reviews = await prisma.review.findMany({
      where: { bookId },
      take: req.query.limit ? Number(req.query.limit) : 10,
      skip: req.query.skip ? Number(req.query.skip) : 0,
    });

    res.status(200).json(new ApiResponse(200, reviews, "Reviews retrieved"));
  }
);

export const getReviewById = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const reviewId = req.params.reviewId;
    console.log(reviewId);

    const userId = req.user.id;
    const review = await prisma.review.findUnique({
      where: { id: reviewId, userId },
    });
    if (!review) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Review not found"));
    }
    res.status(200).json(new ApiResponse(200, review, "Review retrieved"));

    // You can also use the following query for getting a review by its ID and user ID
    // const review = await prisma.review.findUnique({
    //   where: { id: reviewId },
    // });
    // if (!review) {
    //   return res.status(404).json({
    //     success: false,
    //     error: "Review not found",
    //   });
    // }
    // if (review.userId!== userId) {
    //   return res.status(403).json({
    //     success: false,
    //     error: "Unauthorized to access this review",
    //   });
    // }
  }
);

export const updateReview = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const reviewId = req.params.reviewId;
    const { review } = req.body;
    const userId = req.user.id;

    const updatedReview = await prisma.review.update({
      where: { id: reviewId, userId },
      data: { review },
    });

    res
      .status(200)
      .json(new ApiResponse(200, updatedReview, "Review updated successfully"));
  }
);

export const deleteReview = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId, userId },
    });

    if (!review) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Review not found"));
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.status(200).json(new ApiResponse(200, undefined, "Review deleted"));
  }
);
