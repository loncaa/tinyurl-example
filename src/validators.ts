import zod from "zod";

const inputBodyValidator = zod.object({
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

type InputBody = zod.infer<typeof inputBodyValidator>;

const statisticQueryValidator = zod.object({
  period: zod.enum(["year", "month", "week", "day", "hour"]),
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
});

type StatisticQuery = zod.infer<typeof statisticQueryValidator>;

export {
  inputBodyValidator,
  statisticQueryValidator,
  InputBody,
  StatisticQuery,
};
