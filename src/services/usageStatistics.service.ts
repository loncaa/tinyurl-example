import { Prisma } from "@prisma/client";
import { UsageStatisticDto } from "../commons/types";
import { logger } from "../commons/logger";

export async function findManyByShortUrlId(
  usageStatistics: Prisma.UsageStatisticDelegate<any>,
  id: string,
  period: string,
  take?: number,
  nextCursor?: string
): Promise<UsageStatisticDto[] | null> {
  try {
    const cursorId = nextCursor ? parseInt(nextCursor) : undefined;

    const additionalOptions: { [key: string]: any } = {};
    if (cursorId) {
      additionalOptions["cursor"] = {
        id: cursorId,
      };
      additionalOptions.skip = 1;
    }

    const data = await usageStatistics.findMany({
      take,
      where: {
        shortUrlId: id,
        period,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...additionalOptions,
    });

    return data;
  } catch (erorr) {
    const dbError = erorr as Error;
    logger.error(`Failed to find short url by id: ${dbError.message}`);
  }

  return null;
}

export interface UsageStatisticsUpsertPayload {
  shortUrlId: string;
  period: string;
  value: number;
  year: number;
  counter: number;
}
export async function upsert(
  usageStatistic: Prisma.UsageStatisticDelegate<any>,
  payload: UsageStatisticsUpsertPayload
) {
  const { shortUrlId, period, value, year, counter } = payload;

  const entry = await usageStatistic.findFirst({
    where: {
      shortUrlId,
      period,
      value,
      year,
    },
  });

  if (entry) {
    return await usageStatistic.update({
      where: {
        id: entry.id,
      },
      data: { counter: { increment: counter } },
    });
  }

  return await usageStatistic.create({
    data: {
      shortUrlId: shortUrlId,
      period,
      counter,
      value,
      year,
    },
  });
}
