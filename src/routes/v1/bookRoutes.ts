import express from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../../controllers/v1/bookControllers";


export const bookRoutes = express.Router();

// import the controller functions
bookRoutes.get("/", getBooks);
bookRoutes.get("/:id", getBookById);
bookRoutes.post("/", createBook);
bookRoutes.put("/:id", updateBook);
bookRoutes.delete("/:id", deleteBook);
