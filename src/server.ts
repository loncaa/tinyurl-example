import "./commons/devenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import createError from "http-errors";
import { errorConverter, errorHandler } from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";
import appRoutes from "./routes";
import { StatusCodes } from "http-status-codes";
import { logger } from "./commons/logger";
import { getRedisClient } from "./clients/redis.client";
import { subscribeToExpiredKeyEvents } from "./services/redis.service";
import { RedisClientType } from "@redis/client";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(loggerMiddleware);

app.post("/ping", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("pong");
});

app.use(appRoutes);

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(StatusCodes.NOT_FOUND));
});

// handle error codes
app.use(errorConverter);
app.use(errorHandler);

export function createServer(port: string | number) {
  const server = app.listen(port, async () => {
    logger.info(`🚀 Server ready at: http://localhost:${port}`);

    const redisClient = (await getRedisClient()) as RedisClientType;
    subscribeToExpiredKeyEvents(redisClient);
  });

  return server;
}

export default app;
