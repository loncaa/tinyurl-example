import Sinon from "sinon";
import * as RedisClient from "../../clients/redis.client";

import * as RedisService from "../redis.service";
import { createUniqueId } from "../../commons/shortUrl.utils";
import redisClientMock from "../../clients/mocks/redisClient.mock";
import { RedisClientType } from "@redis/client";
import moment from "moment";

Sinon.stub(RedisClient, "getRedisClient").callsFake(() => redisClientMock);

const FULL_URL = "http://google.com";
let id = createUniqueId();
let redisClient: RedisClientType;

describe("Validate Redis storage Service", () => {
  beforeAll(async () => {
    redisClient = (await RedisClient.getRedisClient()) as RedisClientType;
  });

  it("should store shorten url into redis storage", async () => {
    const data = await RedisService.storeShortUrlData(redisClient, id, {
      full: FULL_URL,
      id,
      private: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(data).toBeDefined();
    expect(data).toContain(id);
  });

  it("should find shorten url in redis storage", async () => {
    const data = await RedisService.fetchData(redisClient, id);

    expect(data).toBeDefined();
    expect(data).toContain(id);
  });

  it("should validate stored statistics data from the redis storage", async () => {
    const date = moment();
    const isStored = await RedisService.storeStatisticData(redisClient, id);

    const day = date.dayOfYear();
    const hour = day * 24 + date.hours();
    const week = date.week();
    const month = date.month();
    const year = date.year();

    const hourKey = RedisService.createStatisticRedisKey(
      id,
      "hour",
      hour,
      year
    );
    const dayKey = RedisService.createStatisticRedisKey(id, "day", day, year);
    const weekKey = RedisService.createStatisticRedisKey(
      id,
      "week",
      week,
      year
    );
    const monthKey = RedisService.createStatisticRedisKey(
      id,
      "month",
      month,
      year
    );
    const yearKey = RedisService.createStatisticRedisKey(
      id,
      "year",
      year,
      year
    );

    const storedHoursCounter = await RedisService.fetchData(
      redisClient,
      hourKey
    );
    const storedDaysCounter = await RedisService.fetchData(redisClient, dayKey);
    const storedWeeksCounter = await RedisService.fetchData(
      redisClient,
      weekKey
    );
    const storedMonthsCounter = await RedisService.fetchData(
      redisClient,
      monthKey
    );
    const storedYearsCounter = await RedisService.fetchData(
      redisClient,
      yearKey
    );

    expect(isStored).toBe(true);
    expect(storedHoursCounter).toBe(1);
    expect(storedDaysCounter).toBe(1);
    expect(storedWeeksCounter).toBe(1);
    expect(storedMonthsCounter).toBe(1);
    expect(storedYearsCounter).toBe(1);
  });
});
