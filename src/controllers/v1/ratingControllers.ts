import { Request, Response } from "express";
import { prisma } from "../../db";
import { CustomRequest } from "../../types";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const createRating = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { bookId, rating } = req.body;
    const userId = req.user.id;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res
        .status(404)
        .json(new ApiResponse(404, undefined, "Book not found"));
    }

    const newRating = await prisma.rating.create({
      data: {
        bookId,
        userId,
        rating,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, newRating, "Rating created successfully"));
  }
);

export const getRatingsByBookId = asyncHandler(async (req: Request, res: Response) => {
  const bookId = req.query.bookId as string;

  const ratings = await prisma.rating.findMany({
    where: { bookId },
  });

  res.status(200).json(new ApiResponse(200, ratings, "Ratings retrieved"));
});

export const getRatingByRatingId = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const ratingId = req.params.ratingId;
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Rating not found"));
    }

    res.status(200).json(new ApiResponse(200, rating, "Rating retrieved"));
  }
);

export const updateRating = asyncHandler(
  async (req: Request, res: Response) => {
    const ratingId = req.params.ratingId;
    const { rating } = req.body;

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: { rating },
    });

    res
      .status(200)
      .json(new ApiResponse(200, updatedRating, "Rating updated successfully"));
  }
);

export const deleteRating = asyncHandler(async (req: CustomRequest, res: Response) => {
  const ratingId = req.params.ratingId;
  await prisma.rating.delete({
    where: { id: ratingId },
  });
  res
    .status(200)
    .json(new ApiResponse(200, undefined, "Rating deleted successfully"));
});
