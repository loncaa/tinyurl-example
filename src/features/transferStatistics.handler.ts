import prisma from "../clients/db.client";
import { logger } from "../commons/logger";
import { RedisClientType } from "@redis/client";
import * as UsageStatisticsService from "../services/usageStatistics.service";

export const USAGE_STATISTICS_KEY = "us";

async function processUsageStatisticsData(
  redisClient: RedisClientType,
  key: string
) {
  const keyParts = key.split(`:`);
  const shortUrlId = keyParts[1];
  const periodId = keyParts[2];
  const periodValue = parseInt(keyParts[3]);
  const yearOfPeriod = parseInt(keyParts[4]);

  const periodCount = parseInt((await redisClient.get(key)) || "0");

  await UsageStatisticsService.upsert(prisma.usageStatistic, {
    shortUrlId: shortUrlId,
    period: periodId,
    value: periodValue,
    year: yearOfPeriod,
    counter: periodCount,
  });

  await redisClient.del(key);
}

export default async function transferUsageStatistics(
  redisClient: RedisClientType,
  shortUrlId: string
) {
  logger.info("Statistics transfer started");

  const { keys } = await redisClient.scan(0, {
    COUNT: 5, // "week", "year", "day", "hour", "month"
    MATCH: `${USAGE_STATISTICS_KEY}:${shortUrlId}:*`,
  });

  keys.forEach((key) => processUsageStatisticsData(redisClient, key));
}
