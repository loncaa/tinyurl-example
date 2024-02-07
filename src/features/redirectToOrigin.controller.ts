import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getClient } from "../clients/redis.client";
import prisma from "../clients/db.client";
import { ShortUrlDto } from "../commons/types";
import { findById } from "../services/shortUrl.service";
import { RedisClientType } from "redis";
import * as RedisService from "../services/redis.service";

export default async function RedirectToOriginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const redisClient = (await getClient()) as RedisClientType;
  const dataStringified = await redisClient.get(id);

  if (dataStringified) {
    try {
      const data = JSON.parse(dataStringified) as ShortUrlDto;

      RedisService.storeStatisticData(redisClient, id);
      return res.redirect(data.full);
    } catch (parseError) {
      return next(parseError);
    }
  }

  const shortUrl = await findById(prisma.shortUrl, id);
  if (!shortUrl) {
    return res.status(StatusCodes.OK).send({
      message: "Url not found",
    });
  }

  RedisService.storeShortUrlData(redisClient, id, shortUrl);
  RedisService.storeStatisticData(redisClient, id);

  return res.redirect(shortUrl.full);
}
