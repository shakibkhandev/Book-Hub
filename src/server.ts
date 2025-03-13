import dotenv from "dotenv";
import { httpServer } from "./app";
import logger from "./logger/winston.log";
dotenv.config();

const startServer = () => {
  const port = process.env.PORT || 8080;
  httpServer.listen(process.env.PORT || 8080, () => {
    logger.info(`📑 Visit the documentation at: http://localhost:${port}`);
    logger.info("⚙️  Server is running on port: " + port);
  });
};

startServer();
