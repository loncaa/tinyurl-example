import prisma from "../clients/db.client";
import { logger } from "../commons/logger";
import { RedisClientType } from "@redis/client";
import * as UsageStatisticsService from "../services/usageStatistics.service";
import { UpsertStatisticPayload } from "../commons/types";

export const USAGE_STATISTICS_KEY = "us";

function mapToUpsertStatisticPayload(
  key: string,
  counterString: string
): UpsertStatisticPayload | null {
  try {
    const periodCount = parseInt(counterString);

    const keyParts = key.split(`:`);
    const shortUrlId = keyParts[1];
    const periodKey = keyParts[2];
    const periodValue = parseInt(keyParts[3]);
    const yearOfPeriod = parseInt(keyParts[4]);

    return {
      shortUrlId: shortUrlId,
      period: periodKey,
      value: periodValue,
      year: yearOfPeriod,
      counter: periodCount,
    };
  } catch (error) {
    const mapError = error as Error;
    logger.error(
      `Failed to crate statistic upsert payload: ${mapError.message}`
    );
  }

  return null;
}

async function storeData(redisClient: RedisClientType, key: string) {
  const counterString = (await redisClient.get(key)) || "0";

  const payload = await mapToUpsertStatisticPayload(key, counterString);
  if (!payload) return;

  await UsageStatisticsService.upsert(prisma.usageStatistic, payload);

  await redisClient.del(key);
}

export default async function persistUsageStatisticsData(
  redisClient: RedisClientType,
  shortUrlId: string
) {
  const { keys } = await redisClient.scan(0, {
    COUNT: 6, // "week", "year", "day", "hour", "month"
    MATCH: `${USAGE_STATISTICS_KEY}:${shortUrlId}:*`,
  });

  // TODO: create a bulk update/transaction to db, and redis pipe
  keys.forEach((key) => storeData(redisClient, key));
}
