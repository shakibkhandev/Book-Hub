import { prisma } from "../../db";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAuthors = asyncHandler(async (req, res) => {
  const authors = prisma.user.findMany({
    where: {
      role: "AUTHOR",
    },
    take: 10,
  });

  res
    .status(200)
    .json(new ApiResponse(200, authors, "Authors retrieved successfully"));
});

export const getAuthorById = asyncHandler(async (req, res) => {
  const author = prisma.user.findUnique({
    where: {
      id: req.params.id,
      role: "AUTHOR",
    },
  });

  if (!author) {
    return res.status(404).json(new ApiResponse(404, null, "Author not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, author, "Author retrieved successfully"));
});

export const joinAsAuthor = asyncHandler(async (req, res) => {
  const {} = req.body;
});

export const leaveAsAuthor = asyncHandler(async (req, res) => {
  res.send("updateAuthor");
});
