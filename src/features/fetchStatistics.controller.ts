import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../clients/db.client";
import * as UsageStatisticsService from "../services/usageStatistics.service";
import { StatisticQuery } from "../validators";
import moment from "moment";

export default async function FetchStatisticsController(
  req: Request,
  res: Response
) {
  const { period, take, cursor, order, startingYear } =
    req.query as StatisticQuery;
  const { id } = req.params;

  const fetchQuantity = take ? parseInt(take) : 10;
  const orderBy = order || "desc";
  const year = startingYear ? parseInt(startingYear) : moment().year();

  const statistics = await UsageStatisticsService.findManyByShortUrlId(
    prisma.usageStatistic,
    {
      id,
      period,
      take: fetchQuantity,
      nextCursor: cursor,
      year,
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
