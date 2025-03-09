import dotenv from "dotenv";
import { httpServer } from "./app";
import logger from "./logger/winston.log";
import path from 'path'
import fs from 'fs'
dotenv.config();




const startServer = () => {
  console.log(path.join(process.cwd(), "swagger.yaml"));
  
  httpServer.listen(process.env.PORT || 8080, () => {
    logger.info(
      `📑 Visit the documentation at: http://localhost:${
        process.env.PORT || 8080
      }`
    );
    logger.info("⚙️  Server is running on port: " + process.env.PORT);
  });
};

startServer();
