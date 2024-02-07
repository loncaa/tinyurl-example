import { Prisma } from "@prisma/client";
import { ShortUrlDto } from "../commons/types";
import { logger } from "../commons/logger";

const createShortenUrl = (uniqueId: string) =>
  `${process.env.HOST}/${uniqueId}`;

const mapToCreateShortenUrlData = (uniqueId: string, full: string) => ({
  id: uniqueId,
  full: full,
  shorten: createShortenUrl(uniqueId),
});

export async function create(
  shortUrl: Prisma.ShortUrlDelegate<any>,
  uniqueId: string,
  full: string
): Promise<ShortUrlDto | null> {
  try {
    const payload = mapToCreateShortenUrlData(uniqueId, full);
    const data = await shortUrl.create({
      data: payload,
    });

    return data;
  } catch (erorr) {
    const dbError = erorr as Error;
    logger.error(`Failed to create short url: ${dbError.message}`);
  }

  return null;
}

export async function findByUrl(
  shortUrl: Prisma.ShortUrlDelegate<any>,
  full: string
): Promise<ShortUrlDto | null> {
  try {
    const data = await shortUrl.findFirst({
      where: {
        full: full,
      },
    });

    return data;
  } catch (erorr) {
    const dbError = erorr as Error;
    logger.error(`Failed to find short url by full url: ${dbError.message}`);
  }

  return null;
}

export async function findById(
  shortUrl: Prisma.ShortUrlDelegate<any>,
  id: string
): Promise<ShortUrlDto | null> {
  try {
    const data = await shortUrl.findFirst({
      where: {
        id: id,
      },
    });

    return data;
  } catch (erorr) {
    const dbError = erorr as Error;
    logger.error(`Failed to find short url by id: ${dbError.message}`);
  }

  return null;
}