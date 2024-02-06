import "./src/commons/devenv";
import { logger } from "./src/commons/logger";

import { getClient } from "./src/clients/redis.client";

logger.info(`Redis connection test started`);

getClient().then(async (client) => {
  client.set("connection-check", new Date().toUTCString());
  const checkDate = await client.get("connection-check");
  logger.info(`Connection checked at ${checkDate}`);
});
