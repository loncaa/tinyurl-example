import request from "supertest";
import { ShortenUrlPayload } from "../../shortenUrl/shortenUrl.validator";

import * as DbClient from "../../../clients/db.client";
import * as RedisClient from "../../../clients/redis.client";

import redisClientMock from "../../../clients/mocks/redisClient.mock";
import dbClientMock from "../../../clients/mocks/dbClient.mock";

Sinon.stub(RedisClient, "getRedisClient").callsFake(() => redisClientMock);
Sinon.stub(DbClient, "getDbClient").callsFake(() => dbClientMock);

import server from "../../../index";
import Sinon from "sinon";
import { ShortUrlDto } from "../../../commons/types";
import persistUsageStatisticsData from "../../transferStatistics.handler";

const requestService = request(server);

const shortUrlPayload: ShortenUrlPayload = {
  full: "http://google.com",
};
let shortUrlDto: ShortUrlDto | null = null;

describe("Validate Redirect to Origin controller", () => {
  beforeAll(async () => {
    const { body } = await requestService
      .post("/api/shorten")
      .send(shortUrlPayload)
      .set("x-api-key", "api-key");

    await requestService.get(`/${body?.id}`);
    await persistUsageStatisticsData(redisClientMock, body?.id);

    shortUrlDto = { ...body };
  });

  it("should fetch statistics", async () => {
    const response = await requestService
      .get(`/api/statistics/${shortUrlDto?.id}?period=week`)
      .set("x-api-key", "api-key");

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(202);
    expect(body.statistics).toBeDefined();
  });

  it("should fail because of missing required query param", async () => {
    const response = await requestService
      .get(`/api/statistics/${shortUrlDto?.id}`)
      .set("x-api-key", "api-key");

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(400);
    expect(body.message).toContain("Failed to validate payload");
  });

  it("should fail because of missing auth header", async () => {
    const response = await requestService.get(
      `/api/statistics/${shortUrlDto?.id}`
    );

    const { statusCode, body } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(401);
    expect(body.message).toContain("User Unauthorized");
  });

  it("should fail because special character are not allowed", async () => {
    const response = await requestService
      .get(`/api/statistics/=..=`)
      .set("x-api-key", "api-key");

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(400);
    expect(body.message).toContain("Failed to validate payload");
  });
});
