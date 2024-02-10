import moment from "moment";
import zod from "zod";

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
    .refine(
      (value) => parseInt(value) <= 100,
      "Take quantity cannot be no more than 100"
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

const statisticParamsValidator = zod.object({
  id: zod
    .string()
    .trim()
    .min(3, { message: "Required minimum of 3 characters" })
    .refine(
      (value) => /^[a-zA-Z0-9]*$/.test(value),
      "Id should contain only numbers and letters"
    ),
});

type StatisticQuery = zod.infer<typeof statisticQueryValidator>;

export { StatisticQuery, statisticQueryValidator, statisticParamsValidator };
