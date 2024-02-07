import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../clients/db.client";
import * as UsageStatisticsService from "../services/usageStatistics.service";
import { StatisticQuery } from "../validators";

export default async function FetchStatisticsController(
  req: Request,
  res: Response
) {
  const { period, take, cursor, order, from } =
    req.query as unknown as StatisticQuery;
  const { id } = req.params;

  const fetchQuantity = take ? parseInt(take) : 10;
  const orderBy = order || "desc";
  const startingFrom = from
    ? new Date(from)
    : new Date(new Date().getFullYear(), 0, 1);

  const statistics = await UsageStatisticsService.findManyByShortUrlId(
    prisma.usageStatistic,
    {
      id,
      period,
      take: fetchQuantity,
      nextCursor: cursor,
      startingFrom,
      orderBy,
    }
  );

  if (!statistics) {
    return res.status(StatusCodes.OK).send({
      message: "Statistics not found",
    });
  }

  const nextCursor =
    statistics.length === fetchQuantity
      ? statistics[statistics.length - 1].id
      : null;

  return res.status(StatusCodes.ACCEPTED).send({
    statistics,
    nextCursor,
  });
}
