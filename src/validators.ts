import zod from "zod";

const inputBodyValidator = zod.object({
  full: zod.string().trim().url(),
  short: zod
    .string()
    .min(3, { message: "required minimum of 3 characters" })
    .optional(),
});

export { inputBodyValidator };
