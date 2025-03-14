import axios from "axios";
import cloudinary from "cloudinary";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { errorHandler } from "./middlewares/error.middlewares";
import { v1Routes } from "./routes/v1";
import { v2Routes } from "./routes/v2";
import { v3Routes } from "./routes/v3";
import bodyParser from "body-parser";
import fs from "fs"
import path from "path"
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app: Application = express();

export const httpServer = createServer(app);

const swaggerDocument = YAML.parse(
  fs.readFileSync(
    path.join(__dirname, "../swagger.yaml"),
    "utf8"
  )
);

// Middleware to parse JSON bodies

const middleware = [
  bodyParser.json({ limit: "16kb" }),
  bodyParser.urlencoded({ extended: true, limit: "16kb" }),
  morgan("dev"),
];
app.use(middleware);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "BOOK_HUB_API_KEY", "if-none-match"],
    exposedHeaders: ["Authorization", "BOOK_HUB_API_KEY", "if-none-match"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is running" });
});
app.get("/api/health-check", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api/v1/", v1Routes);
app.use("/api/v2/", v2Routes);
app.use("/api/v3/", v3Routes);

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: "none", // keep all the sections collapsed by default
    },
    customSiteTitle: "Book Hub API docs",
  })
);


// Error handling middleware
app.use(errorHandler);
