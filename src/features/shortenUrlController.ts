import { Request, Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";
import { InputBody } from "../validators";
import prisma from "../clients/db.client";
import createError from "http-errors";
import { v4 } from "uuid";
import { getClient } from "../clients/redis.client";

const createUniqueId = () => v4().replace(/-/g, "");

const createShortenUrl = (uniqueId: string) =>
  `${process.env.HOST}/${uniqueId}`;

export default async function ShortenUrlController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { full, short } = req.body as InputBody;

  const redisClient = await getClient();
  let uniqueId = createUniqueId();

  if (short) {
    uniqueId = short;

    const dataStringified = await redisClient.get(uniqueId);

    if (dataStringified) {
      return next(createError(StatusCodes.BAD_REQUEST, "Short not accepted"));
    }

    const shortUrl = await prisma.shortUrl.findFirst({
      where: {
        id: uniqueId,
      },
    });

    if (shortUrl) {
      // not found in Redis but exists in Db
      await redisClient.set(uniqueId, JSON.stringify(shortUrl));
      return next(createError(StatusCodes.BAD_REQUEST, "Short not accepted"));
    }
  }

  const data = await prisma.shortUrl.create({
    data: {
      id: uniqueId,
      full: full,
      shorten: createShortenUrl(uniqueId),
    },
  });

  redisClient.set(uniqueId, JSON.stringify(data));

  res.status(StatusCodes.CREATED).send(data);
}
