import request from "supertest";
import { ShortenUrlPayload } from "../shortenUrl.validator";

import * as DbClient from "../../../clients/db.client";
import * as RedisClient from "../../../clients/redis.client";

import redisClientMock from "../../../clients/mocks/redisClient.mock";
import dbClientMock from "../../../clients/mocks/dbClient.mock";

Sinon.stub(RedisClient, "getRedisClient").callsFake(() => redisClientMock);
Sinon.stub(DbClient, "getDbClient").callsFake(() => dbClientMock);

import server from "../../../index";
import Sinon from "sinon";

const requestService = request(server);

const shortUrlPayload: ShortenUrlPayload = {
  full: "http://google.com",
};

describe("Validate Shorten url controller", () => {
  it("should create shorten url", async () => {
    const response = await requestService
      .post("/api/shorten")
      .send(shortUrlPayload)
      .set("x-api-key", "api-key");

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.full).toContain(shortUrlPayload.full);
    expect(body.url).toContain(body.id);
  });

  it("should return already created shorten url", async () => {
    const response = await requestService
      .post("/api/shorten")
      .send(shortUrlPayload)
      .set("x-api-key", "api-key");

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(202);
    expect(body.id).toBeDefined();
    expect(body.full).toContain(shortUrlPayload.full);
  });

  it("should create shorten url with custom url", async () => {
    shortUrlPayload.short = "custom";

    const response = await requestService
      .post("/api/shorten")
      .send(shortUrlPayload)
      .set("x-api-key", "api-key");

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.full).toContain(shortUrlPayload.full);
    expect(body.url).toContain(shortUrlPayload.short);
  });

  it("should fail because shorten url with custom url already exists", async () => {
    shortUrlPayload.short = "custom";

    const response = await requestService
      .post("/api/shorten")
      .send(shortUrlPayload)
      .set("x-api-key", "api-key");

    const { body, statusCode } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(400);
    expect(body.message).toContain("Short not accepted");
  });

  it("should fail with validation of payload", async () => {
    shortUrlPayload.full = "not-url";

    const response = await requestService
      .post("/api/shorten")
      .send(shortUrlPayload)
      .set("x-api-key", "api-key");

    const { statusCode, body } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(400);
    expect(body.message).toContain("Failed to validate payload");
  });

  it("should fail with validation of header", async () => {
    const response = await requestService
      .post("/api/shorten")
      .send(shortUrlPayload);

    const { statusCode, body } = response;

    expect(response).toBeDefined();
    expect(statusCode).toBe(401);
    expect(body.message).toContain("User Unauthorized");
  });
});
