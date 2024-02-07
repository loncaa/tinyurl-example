import moment from "moment";
import zod from "zod";

const shortenUrlPayloadValidator = zod.object({
  full: zod.string().trim().url(),
  short: zod
    .string()
    .min(3, { message: "Required minimum of 3 characters" })
    .refine(
      (value) => /^[a-zA-Z0-9]*$/.test(value),
      "Id should contain only numbers and letters"
    )
    .optional(),
});

type ShortenUrlPayload = zod.infer<typeof shortenUrlPayloadValidator>;

const statisticQueryValidator = zod.object({
  period: zod.enum(["year", "month", "week", "day", "hour"]),
  from: zod
    .string()
    .refine((value) => {
      const date = moment(value, "YYYY-MM-DD");
      return date.isValid();
    }, "Date should be formatted like 'YYYY-MM-DD'")
    .optional(),
  take: zod
    .string()
    .refine(
      (value) => /^[0-9]*$/.test(value),
      "Take should contain only numbers"
    )
    .optional(),
  cursor: zod
    .string()
    .refine(
      (value) => /^[0-9]*$/.test(value),
      "Cursor should contain only numbers"
    )
    .optional(),
  order: zod.enum(["asc", "desc"]).optional(),
});

type StatisticQuery = zod.infer<typeof statisticQueryValidator>;

export {
  shortenUrlPayloadValidator,
  statisticQueryValidator,
  ShortenUrlPayload,
  StatisticQuery,
};
