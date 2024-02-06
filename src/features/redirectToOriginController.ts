import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getClient } from "../clients/redis.client";
import prisma from "../clients/db.client";
import { ShortUrlDto } from "../commons/types";
import { findById } from "../services/ShortUrlService";
import { USAGE_STATISTICS_KEY } from "./transferStatistics";

function storeStatisticData(redisClient: any, req: Request, id: string) {
  const usageStatisticsKey = `${USAGE_STATISTICS_KEY}:${id}`;
  redisClient.lPush(usageStatisticsKey, new Date().toUTCString());
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

      storeStatisticData(redisClient, req, id);
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

  // not found in Redis but exists in Db
  redisClient.set(id, JSON.stringify(shortUrl));

  storeStatisticData(redisClient, req, id);
  return res.redirect(shortUrl.full);
}
