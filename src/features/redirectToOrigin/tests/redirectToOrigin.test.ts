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

    shortUrlDto = { ...body };
  });

  it("should redirect to full url", async () => {
    const response = await requestService.get(`/${shortUrlDto?.id}`);

    const { statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(302);
  });

  it("should return not found message", async () => {
    const response = await requestService.get(`/notfound`);

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(200);
    expect(body.message).toContain("not found");
  });

  it("should fail because special character are not allowed", async () => {
    const response = await requestService.get(`/=..=`);

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(400);
    expect(body.message).toContain("Failed to validate payload");
  });
});
