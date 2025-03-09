
import express from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../../controllers/v1/bookControllers";
import { getAuthorById, getAuthors, joinAsAuthor, leaveAsAuthor } from "../../controllers/v1/authorControllers";


export const authorRoutes = express.Router();

// import the controller functions
authorRoutes.get("/", getAuthors);
authorRoutes.get("/author/:id", getAuthorById);
authorRoutes.post("/join", joinAsAuthor);
authorRoutes.post("/leave", leaveAsAuthor);

