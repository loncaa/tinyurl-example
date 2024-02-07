import { Prisma } from "@prisma/client";
import { UsageStatisticDto } from "../commons/types";
import { logger } from "../commons/logger";

export async function findManyByShortUrlId(
  statistics: Prisma.UsageStatisticDelegate<any>,
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

    const data = await statistics.findMany({
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
