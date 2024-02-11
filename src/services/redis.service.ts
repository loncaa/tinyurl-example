import { RedisClientType } from "@redis/client";
import moment from "moment";
import { ShortUrlDto } from "../commons/types";
import persistUsageStatisticsData, {
  USAGE_STATISTICS_KEY,
} from "../features/transferStatistics/transferStatistics.handler";
import { logger } from "../commons/logger";

export function createStatisticRedisKey(
  id: string,
  type: "hour" | "day" | "week" | "month" | "year",
  value: number | string,
  currentYear: number | string
) {
  const usageStatisticsKey = `${USAGE_STATISTICS_KEY}:${id}`;
  return `${usageStatisticsKey}:${type}:${value}:${currentYear}`;
}

export function storeStatisticData(redisClient: RedisClientType, id: string) {
  const now = moment();

  const day = now.dayOfYear();
  const hour = day * 24 + now.hours();
  const week = now.week();
  const month = now.month();
  const year = now.year();

  try {
    const timerValue = 60; // 1 minute, for testing purposes

    const hourKey = createStatisticRedisKey(id, "hour", hour, year);
    const dayKey = createStatisticRedisKey(id, "day", day, year);
    const weekKey = createStatisticRedisKey(id, "week", week, year);
    const monthKey = createStatisticRedisKey(id, "month", month, year);
    const yearKey = createStatisticRedisKey(id, "year", year, year);

    Promise.all([
      redisClient.incr(hourKey),
      redisClient.incr(dayKey),
      redisClient.incr(weekKey),
      redisClient.incr(monthKey),
      redisClient.incr(yearKey),
      redisClient.set(`t:${id}`, "timer", { NX: true, EX: timerValue }), // set a timer, but only if it not exists for this key
    ]);

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
    // redis key expires after 3 days, just in case data from database is removed manually
    return redisClient.set(id, JSON.stringify(shortUrl), {
      EX: 60 * 60 * 24 * 3,
    });
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

export async function subscribeToExpiredKeyEvents(
  redisClient: RedisClientType
) {
  const expireKeyEvent = "__keyevent@0__:expired";

  const subClient = redisClient.duplicate();
  await subClient.connect();
  await subClient.sendCommand([
    "CONFIG",
    "SET",
    "notify-keyspace-events",
    "Ex",
  ]);

  subClient.subscribe(expireKeyEvent, (message, channel) => {
    if (channel !== expireKeyEvent || !message.includes("t:")) {
      return;
    }

    const keyParts = message.split(":");
    const shortUrlId = keyParts[1];

    return persistUsageStatisticsData(redisClient, shortUrlId);
  });
}
