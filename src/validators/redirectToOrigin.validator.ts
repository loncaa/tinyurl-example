import zod from "zod";

const redirectToOriginParamsValidator = zod.object({
  id: zod
    .string()
    .trim()
    .min(3, { message: "Required minimum of 3 characters" })
    .refine(
      (value) => /^[a-zA-Z0-9]*$/.test(value),
      "Id should contain only numbers and letters"
    ),
});

type RedirectToOriginParams = zod.infer<typeof redirectToOriginParamsValidator>;

export { redirectToOriginParamsValidator, RedirectToOriginParams };
