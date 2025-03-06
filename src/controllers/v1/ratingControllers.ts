import { Request, Response } from "express";
import { prisma } from "../../db";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

interface CustomRequest extends Request {
  user?: any; // You can replace 'any' with a proper User type
}

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

export const getRatings = asyncHandler(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  const ratings = await prisma.rating.findMany({
    where: { bookId },
  });

  res.status(200).json(new ApiResponse(200, ratings, "Ratings retrieved"));
});

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
