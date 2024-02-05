import * as Express from "express";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { logger } from "../commons/logger";

const { HttpError } = createError;

const IS_DEV = process.env.NODE_ENV === "development";

export const errorConverter = (
  err: Error,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  console.log(err.stack);

  if (!(err instanceof HttpError)) {
    return next(createError(StatusCodes.INTERNAL_SERVER_ERROR, err.message));
  }

  next(err);
};

export const errorHandler = (
  err: createError.HttpError,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  const { body } = req;
  const statusCode = err.status || 200;

  const bodyKeys = Object.keys(body);
  if (IS_DEV && bodyKeys.length !== 0) {
    logger.info(`${JSON.stringify(body)}`);
  }

  return res
    .status(statusCode)
    .json({ error: true, message: err.message, statusCode });
};
