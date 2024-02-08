import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ShortenUrlPayload } from "../validators";
import prisma from "../clients/db.client";
import createError from "http-errors";
import { v4 } from "uuid";
import { getClient } from "../clients/redis.client";
import { logger } from "../commons/logger";
import { Prisma } from "@prisma/client";
import * as ShortUrlService from "../services/shortUrl.service";
import * as RedisService from "../services/redis.service";
import { RedisClientType } from "@redis/client";

const createUniqueId = () => {
  const uuidArray = v4().split("-");
  return uuidArray[uuidArray.length - 1];
};

async function checkIfShortExists(
  redisClient: any,
  dbClient: Prisma.ShortUrlDelegate<any>,
  uniqueId: string
) {
  const dataStringified = await RedisService.fetchData(redisClient, uniqueId);

  if (dataStringified) {
    return true;
  }

  const shortUrl = await ShortUrlService.findById(dbClient, uniqueId);
  if (shortUrl) {
    return true;
  }
  return false;
}

export default async function ShortenUrlController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { full, short } = req.body as ShortenUrlPayload;

  const redisClient = (await getClient()) as RedisClientType;
  const shortUrlClient = prisma.shortUrl;

  let uniqueId = createUniqueId();

  if (short) {
    // check if short id exists
    uniqueId = short;

    const exists = await checkIfShortExists(
      redisClient,
      shortUrlClient,
      uniqueId
    );

    if (exists) {
      return next(createError(StatusCodes.BAD_REQUEST, "Short not accepted"));
    }
  } else {
    // if not exists, check for full url
    const shortUrl = await ShortUrlService.findByUrl(shortUrlClient, full);

    // if it is not private, return it
    if (shortUrl && !shortUrl.private) {
      return res.status(StatusCodes.ACCEPTED).send(shortUrl);
    }
  }

  // otherwise, create a new entry
  const data = await ShortUrlService.create(shortUrlClient, uniqueId, full);
  if (data) {
    RedisService.storeShortUrlData(redisClient, uniqueId, data);
  }

  return res.status(StatusCodes.CREATED).send(data);
}
