import * as DbClient from "../../clients/db.client";
import dbClientMock from "../../clients/mocks/dbClient.mock";
import Sinon from "sinon";
import { getDbClient } from "../../clients/db.client";

import * as ShortUrlService from "../shortUrl.service";
import { createUniqueId } from "../../commons/shortUrl.utils";

Sinon.stub(DbClient, "getDbClient").callsFake(() => dbClientMock);

const FULL_URL = "http://google.com";
let id = createUniqueId();
const dbClient = getDbClient();

describe("Validate Shorten url Service", () => {
  it("should create shorten url db entry", async () => {
    const data = await ShortUrlService.create(dbClient.shortUrl, id, FULL_URL);

    expect(data).toBeDefined();
    expect(data?.id).toBe(id);
  });

  it("should find shorten url by id", async () => {
    const data = await ShortUrlService.findById(dbClient.shortUrl, id);

    expect(data).toBeDefined();
    expect(data?.id).toBe(id);
  });

  it("should return null if shorten url is not found in db", async () => {
    const data = await ShortUrlService.findById(dbClient.shortUrl, "notid");

    expect(data).toBeDefined();
    expect(data).toBe(null);
  });

  it("should find shorten url by full url", async () => {
    const data = await ShortUrlService.findByUrl(dbClient.shortUrl, FULL_URL);

    expect(data).toBeDefined();
    expect(data?.id).toBe(id);
  });
});
