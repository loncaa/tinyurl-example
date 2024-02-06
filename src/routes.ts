import express from "express";
import { isAuthenticated } from "./middleware/auth.middleware";
import { validateRequestPayload } from "./middleware/validation.middleware";
import { inputBodyValidator } from "./validators";
import ShortenUrlController from "./features/shortenUrlController";
import RedirectToOriginController from "./features/redirectToOriginController";
import FetchStatisticsController from "./features/fetchStatisticsController";

const router = express.Router();

router.post(
  "/api/shorten",
  isAuthenticated,
  validateRequestPayload(inputBodyValidator),
  ShortenUrlController
);

router.get("/api/statistics/:id", isAuthenticated, FetchStatisticsController);

router.get("/:id", RedirectToOriginController);

export default router;
