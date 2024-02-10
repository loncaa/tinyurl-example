import express from "express";
import { rateLimit } from "express-rate-limit";
import { isAuthenticated } from "./middleware/auth.middleware";
import {
  validateRequestQuery,
  validateRequestPayload,
  validateRequestParams,
} from "./middleware/validation.middleware";
import { redirectToOriginParamsValidator } from "./features/redirectToOrigin/redirectToOrigin.validator";
import ShortenUrlController from "./features/shortenUrl/shortenUrl.controller";
import RedirectToOriginController from "./features/redirectToOrigin/redirectToOrigin.controller";
import FetchStatisticsController from "./features/fetchStatistics/fetchStatistics.controller";
import { shortenUrlPayloadValidator } from "./features/shortenUrl/shortenUrl.validator";
import {
  statisticParamsValidator,
  statisticQueryValidator,
} from "./features/fetchStatistics/fetchStatistics.validator";

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
  validateRequestParams(statisticParamsValidator),
  validateRequestQuery(statisticQueryValidator),
  FetchStatisticsController
);

router.get(
  "/:id",
  limiter,
  validateRequestParams(redirectToOriginParamsValidator),
  RedirectToOriginController
);

export default router;
