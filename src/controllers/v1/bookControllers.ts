import { prisma } from "../../db";
import { createBookSchema, updateBookSchema } from "../../schema/bookSchema";
import { ApiResponse } from "../../utils/APIResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getBooks = asyncHandler(async (req, res) => {
  const books = await prisma.book.findMany({
    take: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
  });

  res.json(new ApiResponse(200, books, "Books retrieved successfully"));
});

export const getBookById = asyncHandler(async (req, res) => {
  const book = await prisma.book.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  res.json(new ApiResponse(200, book, "Book retrieved successfully"));
});

export const createBook = asyncHandler(async (req, res) => {
  const { title, authorId, avatar, genre, description, publishedDate } =
    req.body;
  const parsedBody = createBookSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(400)
      .json({ success: false, error: parsedBody.error.errors });
  }

  const newBook = await prisma.book.create({
    data: {
      title,
      authorId,
      avatar,
      genre,
      description,
      publishedDate,
    },
  });

  res.status(201).json(
    new ApiResponse(
      201,
      newBook,
      "Book created successfully",
      "",
      "",
      undefined,
      {
        get: `/books/${newBook.id}`,
        update: `/books/${newBook.id}`,
        delete: `/books/${newBook.id}`,
        list: "/books",
      }
    )
  );
});

export const updateBook = asyncHandler(async (req, res) => {
  const { title, authorId, avatar, genre, description, publishedDate } =
    req.body;
  const parsedBody = updateBookSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(400)
      .json({ success: false, error: parsedBody.error.errors });
  }

  const book = await prisma.book.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  const updatedBook = await prisma.book.update({
    where: {
      id: req.params.id,
    },
    data: {
      title,
      avatar,
      genre,
      description,
      publishedDate,
    },
  });

  res.json(
    new ApiResponse(
      200,
      updatedBook,
      "Book updated successfully",
      "",
      "",
      undefined,
      {
        get: `/books/${updatedBook.id}`,
        update: `/books/${updatedBook.id}`,
        delete: `/books/${updatedBook.id}`,
        list: "/books",
      }
    )
  );
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await prisma.book.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  await prisma.book.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json(new ApiResponse(200, {}, "Book deleted successfully"));
});
