import { Prisma } from "@prisma/client";
import { UsageStatisticDto } from "../commons/types";
import { logger } from "../commons/logger";

export async function findByShortUrlId(
  statistics: Prisma.UsageStatisticDelegate<any>,
  id: string
): Promise<UsageStatisticDto[] | null> {
  try {
    const data = await statistics.findMany({
      where: {
        shortUrlId: id,
      },
      orderBy: {},
    });

    return data;
  } catch (erorr) {
    const dbError = erorr as Error;
    logger.error(`Failed to find short url by id: ${dbError.message}`);
  }

  return null;
}
