// after N time, transfer Redis statistics to the Database

import { getClient } from "../clients/redis.client";
import prisma from "../clients/db.client";
import { logger } from "../commons/logger";

export const USAGE_STATISTICS_KEY = "us";

export default async function transferStatistics() {
  logger.info("Statistics transfer started");
  const redisClient = await getClient();

  const counterKeys = await redisClient.keys(`${USAGE_STATISTICS_KEY}:*`);

  counterKeys.forEach(async (key) => {
    const keyParts = key.split(`${USAGE_STATISTICS_KEY}:`);
    const shortUrlId = keyParts[1];
    const arrayKey = `${USAGE_STATISTICS_KEY}:${shortUrlId}`;

    const visitsCounter = await redisClient.lLen(arrayKey);
    const visitsStatistics = await redisClient.lRange(
      arrayKey,
      0,
      visitsCounter
    );

    const manyData = visitsStatistics.map((visitTime) => ({
      shortUrlId,
      createdAt: new Date(visitTime),
    }));

    await prisma.usageStatistic.createMany({
      data: manyData,
    });

    await prisma.visitsCounter.upsert({
      where: {
        id: shortUrlId,
      },
      create: {
        counter: visitsCounter,
        id: shortUrlId,
      },
      update: { counter: { increment: visitsCounter } },
    });

    await redisClient.del(arrayKey);

    logger.info(`${shortUrlId} = ${visitsCounter}`);
  });
}
