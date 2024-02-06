import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../clients/db.client";
import * as StatisticsService from "../services/StatisticsService";

export default async function FetchStatisticsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sort } = req.query;
  const { id } = req.params;

  const statistics = await StatisticsService.findByShortUrlId(
    prisma.usageStatistic,
    id
  );

  const visits = await prisma.visitsCounter.findFirst({
    where: {
      id: id,
    },
  });

  if (!statistics) {
    return res.status(StatusCodes.OK).send({
      message: "Statistics not found",
    });
  }

  return res.status(StatusCodes.ACCEPTED).send({
    statistics,
    visitsCounter: visits,
  });
}
