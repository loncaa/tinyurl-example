import { RedisClientType, createClient } from "redis";
import { logger } from "../commons/logger";

let client: RedisClientType<any> | null = null;

export async function getRedisClient(): Promise<RedisClientType<any>> {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => {
      logger.error(`Redis Client [${process.env.REDIS_URL}] Error: ${err}`);
    });
  }

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}
