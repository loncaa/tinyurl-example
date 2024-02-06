import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../commons/logger";
import { getClient } from "../clients/redis.client";
import prisma from "../clients/db.client";
import createError from "http-errors";
import { ShortUrlDto } from "../commons/types";

function redirectToOrigin(
  redisClient: unknown,
  res: Response,
  originUrl: string
) {
  // increse count in redis
  // store user agent into into redis

  res.redirect(originUrl);
}

export default async function RedirectToOriginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const redisClient = await getClient();
  const dataStringified = await redisClient.get(id);

  if (dataStringified) {
    try {
      const data = JSON.parse(dataStringified) as ShortUrlDto;

      return redirectToOrigin(redisClient, res, data.full);
    } catch (error) {
      const internalError = error as Error;

      return next(
        createError(StatusCodes.INTERNAL_SERVER_ERROR, internalError.message)
      );
    }
  }

  const shortUrl = (await prisma.shortUrl.findFirst({
    where: {
      id: id,
    },
  })) as ShortUrlDto;

  if (shortUrl) {
    // not found in Redis but exists in Db
    redisClient.set(id, JSON.stringify(shortUrl));
    return redirectToOrigin(redisClient, res, shortUrl.full);
  }

  logger.info(`Redirect to ${id}`);
  res.status(StatusCodes.OK).send({
    message: "Url not found",
  });
}
