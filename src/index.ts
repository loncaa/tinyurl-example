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
import transferStatistics from "./features/transferStatistics.handler";

const SERVER_PORT = process.env.SERVER_PORT;

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

app.listen(SERVER_PORT, () =>
  logger.info(`🚀 Server ready at: http://localhost:${SERVER_PORT}`)
);

// fetch the counters from REDIS and transfer them to the database every 10 minutes
setInterval(() => {
  transferStatistics();
}, 10 * 60 * 1000);
