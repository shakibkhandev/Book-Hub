import { Request, Response } from "express";
import { prisma } from "../../db";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

interface CustomRequest extends Request {
  user?: any; // You can replace 'any' with a proper User type
}

export const createReview = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { bookId, rating, review } = req.body;
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
    const bookId = req.params.bookId;

    const reviews = await prisma.review.findMany({
      where: { bookId },
      include: { user: true },
    });

    res.status(200).json(new ApiResponse(200, reviews, "Reviews retrieved"));
  }
);

export const updateReview = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const reviewId = req.params.reviewId;
    const { review } = req.body;

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
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

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.status(204).json(new ApiResponse(204, undefined, "Review deleted"));
  }
);