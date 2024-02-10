import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getDbClient } from "../clients/db.client";
import createError from "http-errors";
import { getRedisClient } from "../clients/redis.client";
import { Prisma } from "@prisma/client";
import * as ShortUrlService from "../services/shortUrl.service";
import * as RedisService from "../services/redis.service";
import { RedisClientType } from "@redis/client";
import { createUrl, createUniqueId } from "../commons/shortUrl.utils";
import { ShortenUrlErrorMessage } from "../commons/error.factory";
import { ShortenUrlPayload } from "../validators/shortenUrl.validator";

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

  const redisClient = (await getRedisClient()) as RedisClientType;
  const dbClient = getDbClient();

  const shortUrlClient = dbClient.shortUrl;

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
      return next(
        createError(
          StatusCodes.BAD_REQUEST,
          ShortenUrlErrorMessage.ShortNotAccepted
        )
      );
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
  if (!data) {
    return next(
      createError(StatusCodes.CONFLICT, ShortenUrlErrorMessage.Failed)
    );
  }

  RedisService.storeShortUrlData(redisClient, uniqueId, data);
  const shortUrl = createUrl(data.id);

  return res.status(StatusCodes.CREATED).send({
    ...data,
    url: shortUrl,
  });
}
