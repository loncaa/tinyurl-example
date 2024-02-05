import * as Express from "express";
import * as Zod from "zod";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";

export interface ZodValidationError {
  failed: boolean;
  message: string;
}

export const verifyRequest = (
  schema: Zod.Schema,
  data: unknown
): typeof schema | ZodValidationError => {
  const parseResponse = schema.safeParse(data);
  if (!parseResponse.success) {
    const { error } = parseResponse as Zod.SafeParseError<typeof schema>;
    return {
      failed: true,
      message: error.message,
    };
  }

  return parseResponse.data;
};

/**
 * Validate only a requests body payload
 * @param schema body payload required schema
 * @returns
 */
export const validateRequestPayload =
  (schema: Zod.Schema) =>
  (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    const reqObject = req.body;

    const validationResponse = verifyRequest(schema, reqObject);

    const validationResponseError = validationResponse as ZodValidationError;

    if (validationResponseError.failed) {
      const errorMessage = validationResponseError.message;
      return next(createError(StatusCodes.BAD_REQUEST, errorMessage));
    }

    return next();
  };
