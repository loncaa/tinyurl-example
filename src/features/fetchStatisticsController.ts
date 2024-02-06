import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../commons/logger";
import { getClient } from "../clients/redis.client";
import prisma from "../clients/db.client";
import createError from "http-errors";
import { ShortUrlDto } from "../commons/types";

export default async function FetchStatisticsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  res.status(StatusCodes.OK).send(id);
}
