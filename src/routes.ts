import express, { Request, Response } from "express";
import { isAuthenticated } from "./middleware/auth.middleware";
import { validateRequestPayload } from "./middleware/validation.middleware";
import { inputBodyValidator } from "./validators";
import { StatusCodes } from "http-status-codes";
import ShortenUrlController from "./features/shortenUrl/controller";
import RedirectToOriginController from "./features/redirectToOrigin/controller";

const router = express.Router();

router.post(
  "/api/shorten",
  isAuthenticated,
  validateRequestPayload(inputBodyValidator),
  ShortenUrlController
);

router.get("/:id", RedirectToOriginController);

export default router;
