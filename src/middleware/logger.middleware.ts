import morgan from "morgan";
import { logger } from "../commons/logger";

const stream = {
  write: (message: string) => {
    logger.info(`${message.trim()}`);
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const loggerFormat = `:method :url :status :response-time ms - :res[content-length]`;

// Build the morgan middleware
export default morgan(loggerFormat, { stream, skip });
