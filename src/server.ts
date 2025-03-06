import dotenv from "dotenv";
import { httpServer } from "./app";
import logger from "./logger/winston.log";

dotenv.config();

const startServer = () => {
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
