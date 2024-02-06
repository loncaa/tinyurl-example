import { createClient } from "redis";
import { logger } from "../commons/logger";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  logger.error(`Redis Client [${process.env.REDIS_URL}] Error: ${err}`);
});

export async function getClient(): Promise<typeof client> {
  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}
