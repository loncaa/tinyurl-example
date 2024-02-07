import express from "express";
import { rateLimit } from "express-rate-limit";
import { isAuthenticated } from "./middleware/auth.middleware";
import {
  validateRequestQuery,
  validateRequestPayload,
} from "./middleware/validation.middleware";
import {
  shortenUrlPayloadValidator,
  statisticQueryValidator,
} from "./validators";
import ShortenUrlController from "./features/shortenUrl.controller";
import RedirectToOriginController from "./features/redirectToOrigin.controller";
import FetchStatisticsController from "./features/fetchStatistics.controller";

// best case scenario: use external server as rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // store: ... , // Use an external store for consistency across multiple server instances.
});

const router = express.Router();

router.post(
  "/api/shorten",
  isAuthenticated,
  validateRequestPayload(shortenUrlPayloadValidator),
  ShortenUrlController
);

router.get(
  "/api/statistics/:id",
  isAuthenticated,
  validateRequestQuery(statisticQueryValidator),
  FetchStatisticsController
);

router.get("/:id", limiter, RedirectToOriginController);

export default router;
