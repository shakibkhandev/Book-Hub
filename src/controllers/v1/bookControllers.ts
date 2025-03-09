import { prisma } from "../../db";
import { createBookSchema, updateBookSchema } from "../../schema/bookSchema";
import { CustomRequest } from "../../types";
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

export const createBook = asyncHandler(async (req: CustomRequest, res) => {
  const { title, avatar, genre, description, publishedDate } = req.body;

  const authorId = req.user.id;

  const userAuthor = await prisma.user.findUnique({
    where:{
      id : authorId
    },
    select: {
      id: true,
      role : true
    }
  })

  if(!userAuthor){
    return res.status(403).json({
      success: false,
      error: "You can't access this content. Please Re-Login"
    })
  }
  if(userAuthor.role !== "AUTHOR"){
    return res.status(403).json({
      success: false,
      error: "Unauthorized to create book. You are not an Author"
    })
  }


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

export const updateBook = asyncHandler(async (req  :CustomRequest, res) => {
  const { title, avatar, genre, description, publishedDate } =
    req.body;

  
  const parsedBody = updateBookSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res
      .status(400)
      .json({ success: false, error: parsedBody.error.errors });
  }

  const userAuthor = await prisma.user.findUnique({
    where:{
      id : req.user.id,
      role : "AUTHOR"
    },
    select: {
      id: true,
      role : true
    }
  })
  if(!userAuthor){
    return res.status(403).json({
      success: false,
      error: "You can't access this content. You are not an Author"
    })
  }

  const book = await prisma.book.findUnique({
    where: {
      id: req.params.id,
      authorId: req.user.id
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

export const deleteBook = asyncHandler(async (req : CustomRequest, res) => {

  const userAuthor = await prisma.user.findUnique({
    where:{
      id : req.user.id,
      role : "AUTHOR"
    },
    select: {
      id: true,
      role : true
    }
  })

  if(!userAuthor){
    return res.status(403).json({
      success: false,
      error: "You can't access this content. You are not an Author"
    })
  }
  


  const book = await prisma.book.findUnique({
    where: {
      id: req.params.id,
      authorId: req.user.id,
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
