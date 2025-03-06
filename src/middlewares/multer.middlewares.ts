import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "path";

// Configure storage settings for Multer
const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    // Ensure that the "public/images" folder exists in the root directory
    // Otherwise, it will throw an error stating that the path cannot be found
    cb(null, "./public/images");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    let fileExtension = "";
    if (file.originalname.includes(".")) {
      fileExtension = path.extname(file.originalname);
    }
    
    // Generate a unique filename: convert to lowercase, replace spaces with hyphens, and append timestamp + random number
    const filenameWithoutExtension = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .split(".")[0]; // Remove the extension
    
    cb(
      null,
      `${filenameWithoutExtension}-${Date.now()}-${Math.ceil(Math.random() * 1e5)}${fileExtension}`
    );
  },
});

// Middleware for handling file uploads
export const upload = multer({
  // storage,
  limits: {
    fileSize: 1 * 1000 * 1000, // Limit file size to 1MB
  },
});