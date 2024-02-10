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

export { shortenUrlPayloadValidator, ShortenUrlPayload };
