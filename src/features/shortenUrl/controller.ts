import { Request, Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";
import { InputBody } from "../../validators";
import prisma from "../../clients/db.client";
import createError from "http-errors";
import { v4 } from "uuid";
import { getClient } from "../../clients/redis.client";

const createUniqueId = () => v4().replace(/-/g, "");

const createShortenUrl = (uniqueId: string) =>
  `${process.env.HOST}/${uniqueId}`;

export default async function ShortenUrlController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { full, short } = req.body as InputBody;
  let uniqueId = createUniqueId();

  if (short) {
    uniqueId = short;

    const shortUrl = await prisma.shortUrl.findFirst({
      where: {
        id: short,
      },
    });

    if (shortUrl) {
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

  const redisClient = await getClient();
  redisClient.set(uniqueId, JSON.stringify(data));

  res.status(StatusCodes.CREATED).send(data);
}
