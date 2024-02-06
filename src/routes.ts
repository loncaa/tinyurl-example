import express from "express";
import { rateLimit } from "express-rate-limit";
import { isAuthenticated } from "./middleware/auth.middleware";
import { validateRequestPayload } from "./middleware/validation.middleware";
import { inputBodyValidator } from "./validators";
import ShortenUrlController from "./features/shortenUrlController";
import RedirectToOriginController from "./features/redirectToOriginController";
import FetchStatisticsController from "./features/fetchStatisticsController";

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
  validateRequestPayload(inputBodyValidator),
  ShortenUrlController
);

router.get("/api/statistics/:id", isAuthenticated, FetchStatisticsController);

router.get("/:id", limiter, RedirectToOriginController);

export default router;
