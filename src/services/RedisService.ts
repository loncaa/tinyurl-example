import { RedisClientType } from "redis";
import moment from "moment";
import { ShortUrlDto } from "../commons/types";
import { USAGE_STATISTICS_KEY } from "../features/transferStatistics";
import { logger } from "../commons/logger";

export function storeStatisticData(redisClient: RedisClientType, id: string) {
  const now = moment();

  const day = now.dayOfYear();
  const hour = day * 24 + now.hours();
  const week = now.week();
  const month = now.month();
  const year = now.year();

  const usageStatisticsKey = `${USAGE_STATISTICS_KEY}:${id}`;

  try {
    redisClient.incr(`${usageStatisticsKey}:hour:${hour}:${year}`);
    redisClient.incr(`${usageStatisticsKey}:day:${day}:${year}`);
    redisClient.incr(`${usageStatisticsKey}:week:${week}:${year}`);
    redisClient.incr(`${usageStatisticsKey}:month:${month}:${year}`);
    redisClient.incr(`${usageStatisticsKey}:year:${year}:${year}`);

    return true;
  } catch (error) {
    const redisError = error as Error;
    logger.error(`Redis failed to store: ${redisError.message}`);
  }

  return null;
}

export function storeShortUrlData(
  redisClient: RedisClientType,
  id: string,
  shortUrl: ShortUrlDto
) {
  try {
    return redisClient.set(id, JSON.stringify(shortUrl));
  } catch (error) {
    const redisError = error as Error;
    logger.error(`Redis failed to store: ${redisError.message}`);
  }

  return null;
}

export function fetchData(redisClient: RedisClientType, key: string) {
  try {
    return redisClient.get(key);
  } catch (error) {
    const redisError = error as Error;
    logger.error(`Redis failed to store: ${redisError.message}`);
  }

  return null;
}
