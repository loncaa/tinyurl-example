import {
  shortenUrlPayloadValidator,
  ShortenUrlPayload,
} from "../shortenUrl.validator";

describe("shortenUrlPayloadValidator", () => {
  it("should validate a valid payload", () => {
    const validPayload = {
      full: "https://example.com",
      short: "abc123",
    };
    const { data, success } = shortenUrlPayloadValidator.safeParse(
      validPayload
    ) as Zod.SafeParseSuccess<ShortenUrlPayload>;

    expect(data).toEqual(validPayload);
    expect(success).toEqual(true);
  });

  it("should fail validation for missing full URL", () => {
    const invalidPayload = {
      short: "abc123",
    };
    const result = shortenUrlPayloadValidator.safeParse(
      invalidPayload
    ) as Zod.SafeParseError<typeof shortenUrlPayloadValidator>;

    const { error, success } = result;

    expect(error?.message).toContain("full");
    expect(error?.message).toContain("Required");
    expect(success).toEqual(false);
  });

  it("should fail validation for invalid full URL", () => {
    const invalidPayload = {
      full: "invalid-url",
      short: "abc123",
    };
    const result = shortenUrlPayloadValidator.safeParse(
      invalidPayload
    ) as Zod.SafeParseError<typeof shortenUrlPayloadValidator>;

    const { error, success } = result;

    expect(error?.message).toContain("Invalid url");
    expect(success).toEqual(false);
  });

  it("should fail validation for short URL less than 3 characters", () => {
    const invalidPayload = {
      full: "https://example.com",
      short: "ab",
    };
    const result = shortenUrlPayloadValidator.safeParse(
      invalidPayload
    ) as Zod.SafeParseError<typeof shortenUrlPayloadValidator>;

    const { error, success } = result;

    expect(error?.message).toContain("Required minimum of 3 characters");
    expect(success).toEqual(false);
  });

  it("should fail validation for short URL containing special characters", () => {
    const invalidPayload = {
      full: "https://example.com",
      short: "abc@123",
    };
    const result = shortenUrlPayloadValidator.safeParse(
      invalidPayload
    ) as Zod.SafeParseError<typeof shortenUrlPayloadValidator>;

    const { error, success } = result;

    expect(error?.message).toContain(
      "Id should contain only numbers and letters"
    );
    expect(success).toEqual(false);
  });
});
