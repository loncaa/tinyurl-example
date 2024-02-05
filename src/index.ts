import "./commons/devenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";
import { isAuthenticated } from "./middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { validateRequestPayload } from "./middleware/validation.middleware";
import { inputBodyValidator } from "./validators";

const app = express();

app.use(cors);
app.use(helmet);

app.use(loggerMiddleware);

app.get(`/test`, isAuthenticated, (req, res) => {
  res.status(StatusCodes.ACCEPTED);
});

app.post(`/test`, validateRequestPayload(inputBodyValidator), (req, res) => {
  res.status(StatusCodes.CREATED);
});

app.use(errorHandler);

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
