import dotenv from "dotenv";
import { logger } from "./logger";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  logger.info("Dev env config loaded");
}
