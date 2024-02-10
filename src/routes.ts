import express from "express";
import { rateLimit } from "express-rate-limit";
import { isAuthenticated } from "./middleware/auth.middleware";
import {
  validateRequestQuery,
  validateRequestPayload,
  validateRequestParams,
} from "./middleware/validation.middleware";
import { redirectToOriginParamsValidator } from "./validators/redirectToOrigin.validator";
import ShortenUrlController from "./features/shortenUrl.controller";
import RedirectToOriginController from "./features/redirectToOrigin.controller";
import FetchStatisticsController from "./features/fetchStatistics.controller";
import { shortenUrlPayloadValidator } from "./validators/shortenUrl.validator";
import { statisticQueryValidator } from "./validators/fetchStatistics.validator";

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

router.get(
  "/:id",
  limiter,
  validateRequestParams(redirectToOriginParamsValidator),
  RedirectToOriginController
);

export default router;
