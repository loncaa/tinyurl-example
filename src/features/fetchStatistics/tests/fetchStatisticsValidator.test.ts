import {
  statisticQueryValidator,
  statisticParamsValidator,
  StatisticQuery,
  StatisticParams,
} from "../fetchStatistics.validator";

describe("Test statistic Query Validator", () => {
  it("should validate a valid query", () => {
    const validQuery = {
      period: "month",
      from: "2022-01-01",
      take: "50",
      cursor: "123",
      order: "asc",
    };
    const result = statisticQueryValidator.safeParse(
      validQuery
    ) as Zod.SafeParseSuccess<StatisticQuery>;
    const { data, success } = result;

    expect(data).toEqual(validQuery);
    expect(success).toEqual(true);
  });

  it("should fail validation for invalid date format", () => {
    const invalidQuery = {
      period: "month",
      from: "invalid-date",
    };
    const result = statisticQueryValidator.safeParse(
      invalidQuery
    ) as Zod.SafeParseError<typeof statisticQueryValidator>;

    const { error, success } = result;

    expect(error?.message).toContain(
      "Date should be formatted like 'YYYY-MM-DD'"
    );
    expect(success).toEqual(false);
  });

  it("should fail validation for take exceeding 100", () => {
    const invalidQuery = {
      period: "month",
      take: "150",
    };
    const result = statisticQueryValidator.safeParse(
      invalidQuery
    ) as Zod.SafeParseError<typeof statisticQueryValidator>;

    const { error, success } = result;

    expect(error?.message).toContain(
      "Take quantity cannot be no more than 100"
    );
    expect(success).toEqual(false);
  });
});

describe("Test statistic Params Validator", () => {
  it("should validate a valid parameter", () => {
    const validParams = {
      id: "abc123",
    };
    const result = statisticParamsValidator.safeParse(
      validParams
    ) as Zod.SafeParseSuccess<StatisticParams>;
    const { data, success } = result;

    expect(data).toEqual(validParams);
    expect(success).toEqual(true);
  });

  it("should fail validation for id less than 3 characters", () => {
    const invalidParams = {
      id: "ab",
    };
    const result = statisticParamsValidator.safeParse(
      invalidParams
    ) as Zod.SafeParseError<typeof statisticQueryValidator>;

    const { error, success } = result;

    expect(error?.message).toContain("Required minimum of 3 characters");
    expect(success).toEqual(false);
  });

  it("should fail validation for id containing special characters", () => {
    const invalidParams = {
      id: "abc@123",
    };
    const result = statisticParamsValidator.safeParse(
      invalidParams
    ) as Zod.SafeParseError<typeof statisticQueryValidator>;

    const { error, success } = result;

    expect(error?.message).toContain(
      "Id should contain only numbers and letters"
    );
    expect(success).toEqual(false);
  });
});
