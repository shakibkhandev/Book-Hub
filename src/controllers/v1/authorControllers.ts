import { prisma } from "../../db";
import { CustomRequest } from "../../types";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAuthors = asyncHandler(async (req, res) => {
  const authors = await prisma.user.findMany({
    where: {
      role: "AUTHOR",
    },
    select:{
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
    take: 10,
  });

  res
    .status(200)
    .json(new ApiResponse(200, authors, "Authors retrieved successfully"));
});

export const getAuthorById = asyncHandler(async (req, res) => {
  const author = await prisma.user.findUnique({
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

export const joinAsAuthor = asyncHandler(async (req: CustomRequest, res) => {
  const userId = req.user.id;
  await prisma.user.update({
    where: { id: userId },
    data: { role: "AUTHOR" },
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Now You are an Author"));
});

export const leaveAsAuthor = asyncHandler(async (req : CustomRequest, res) => {
  const userId = req.user.id;
  await prisma.user.update({
    where: { id: userId },
    data: { role: "USER" },
  });

  await prisma.book.deleteMany({
    where : {
      authorId : userId
    }
  })

  res
   .status(200)
   .json(new ApiResponse(200, null, "You are not An Author Any More. Your All Book Removed From The Book Hub Library"));
});
