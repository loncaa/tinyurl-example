import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../clients/db.client";
import * as StatisticsService from "../services/StatisticsService";
import { StatisticQuery } from "../validators";

export default async function FetchStatisticsController(
  req: Request,
  res: Response
) {
  const { period, take, cursor } = req.query as StatisticQuery;
  const { id } = req.params;

  const fetchQuantity = take ? parseInt(take) : 10;

  const statistics = await StatisticsService.findManyByShortUrlId(
    prisma.usageStatistic,
    id,
    period,
    fetchQuantity,
    cursor
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
