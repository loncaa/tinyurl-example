import prisma from "../clients/db.client";
import { logger } from "../commons/logger";
import { RedisClientType } from "@redis/client";
import * as UsageStatisticsService from "../services/usageStatistics.service";

export const USAGE_STATISTICS_KEY = "us";

async function storeData(redisClient: RedisClientType, key: string) {
  const keyParts = key.split(`:`);
  const shortUrlId = keyParts[1];
  const periodKey = keyParts[2];
  const periodValue = parseInt(keyParts[3]);
  const yearOfPeriod = parseInt(keyParts[4]);

  const periodCount = parseInt((await redisClient.get(key)) || "0");

  await UsageStatisticsService.upsert(prisma.usageStatistic, {
    shortUrlId: shortUrlId,
    period: periodKey,
    value: periodValue,
    year: yearOfPeriod,
    counter: periodCount,
  });

  await redisClient.del(key);
}

export default async function persistUsageStatisticsData(
  redisClient: RedisClientType,
  shortUrlId: string
) {
  const { keys } = await redisClient.scan(0, {
    COUNT: 5, // "week", "year", "day", "hour", "month"
    MATCH: `${USAGE_STATISTICS_KEY}:${shortUrlId}:*`,
  });

  // TODO: create a bulk update/transaction to db, and redis pipe
  keys.forEach((key) => storeData(redisClient, key));
}
