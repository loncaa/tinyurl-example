import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getRedisClient } from "../../clients/redis.client";
import { getDbClient } from "../../clients/db.client";
import { ShortUrlDto } from "../../commons/types";
import { findById } from "../../services/shortUrl.service";
import { RedisClientType } from "@redis/client";
import * as RedisService from "../../services/redis.service";
import { ShortUrlErrorMessage } from "../../commons/error.factory";

export default async function RedirectToOriginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const dbClient = getDbClient();
  const redisClient = (await getRedisClient()) as RedisClientType;
  const dataStringified = await RedisService.fetchData(redisClient, id);

  if (dataStringified) {
    try {
      const data = JSON.parse(dataStringified) as ShortUrlDto;

      RedisService.storeStatisticData(redisClient, id);
      return res.redirect(data.full);
    } catch (parseError) {
      return next(parseError);
    }
  }

  const shortUrl = await findById(dbClient.shortUrl, id);
  if (!shortUrl) {
    return res.status(StatusCodes.OK).send({
      message: ShortUrlErrorMessage.NotFound(id),
    });
  }

  RedisService.storeShortUrlData(redisClient, id, shortUrl);
  RedisService.storeStatisticData(redisClient, id);

  return res.redirect(shortUrl.full);
}
