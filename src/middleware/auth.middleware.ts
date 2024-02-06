import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import createError from "http-errors";
import { AuthErrorMessage } from "../commons/error.factory";

const API_KEY = "x-api-key";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers[API_KEY];

  if (!apiKey)
    return next(
      createError(StatusCodes.UNAUTHORIZED, AuthErrorMessage.Unauthorized)
    );

  //TODO: Check if api key in the database

  return next();
}
