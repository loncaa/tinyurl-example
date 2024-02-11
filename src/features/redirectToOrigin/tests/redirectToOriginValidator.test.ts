import {
  redirectToOriginParamsValidator,
  RedirectToOriginParams,
} from "../redirectToOrigin.validator";

describe("Test redirect to origin params validator", () => {
  it("should validate a valid id", () => {
    const validId = "abc123";
    const response = redirectToOriginParamsValidator.safeParse({
      id: validId,
    }) as Zod.SafeParseSuccess<RedirectToOriginParams>;
    const { data, success } = response;

    expect(data).toEqual({ id: validId });
    expect(success).toEqual(true);
  });

  it("should fail validation for id less than 3 characters", () => {
    const invalidId = "ab";
    const response = redirectToOriginParamsValidator.safeParse({
      id: invalidId,
    }) as Zod.SafeParseError<typeof redirectToOriginParamsValidator>;

    const { error, success } = response;

    expect(error).toBeDefined();
    expect(error?.message).toContain("Required minimum of 3 characters");
    expect(success).toEqual(false);
  });

  it("should fail validation for id containing special characters", () => {
    const invalidId = "abc@123";
    const response = redirectToOriginParamsValidator.safeParse({
      id: invalidId,
    }) as Zod.SafeParseError<typeof redirectToOriginParamsValidator>;

    const { error, success } = response;

    expect(error).toBeDefined();
    expect(error?.message).toContain(
      "Id should contain only numbers and letters"
    );
    expect(success).toEqual(false);
  });

  it("should fail validation for id containing spaces", () => {
    const invalidId = "abc 123";
    const response = redirectToOriginParamsValidator.safeParse({
      id: invalidId,
    }) as Zod.SafeParseError<typeof redirectToOriginParamsValidator>;

    const { error, success } = response;

    expect(error).toBeDefined();
    expect(error?.message).toContain(
      "Id should contain only numbers and letters"
    );
    expect(success).toEqual(false);
  });
});
