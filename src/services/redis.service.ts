import { RedisClientType } from "@redis/client";
import moment from "moment";
import { ShortUrlDto } from "../commons/types";
import persistUsageStatisticsData, {
  USAGE_STATISTICS_KEY,
} from "../features/transferStatistics.handler";
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
    const timerValue = 60 * 10; // 10 minutes

    Promise.all([
      redisClient.incr(`${usageStatisticsKey}:hour:${hour}:${year}`),
      redisClient.incr(`${usageStatisticsKey}:day:${day}:${year}`),
      redisClient.incr(`${usageStatisticsKey}:week:${week}:${year}`),
      redisClient.incr(`${usageStatisticsKey}:month:${month}:${year}`),
      redisClient.incr(`${usageStatisticsKey}:year:${year}:${year}`),
      redisClient.set(`t:${id}`, "timer", { NX: true, EX: timerValue }), // set a timer, but only if not exists for this key
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

export async function subscribeToExpiredKeyEvents(
  redisClient: RedisClientType
) {
  const expireKeyEvent = "__keyevent@0__:expired";

  const subClient = redisClient.duplicate();
  await subClient.connect();
  await subClient.sendCommand(["SET", "notify-keyspace-events", "Ex"]);

  subClient.subscribe(expireKeyEvent, (message, channel) => {
    if (channel !== expireKeyEvent || !message.includes("t:")) {
      return;
    }

    console.log(`Key expired: ${message}`);

    const keyParts = message.split(":");
    const shortUrlId = keyParts[1];

    return persistUsageStatisticsData(redisClient, shortUrlId);
  });
}
