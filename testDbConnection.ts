import "./src/commons/devenv";
import client from "./src/clients/db.client";
import { logger } from "./src/commons/logger";

async function execute() {
  logger.info(`Database connection test started`);

  const datecheck = await client.checkDate.create({
    data: {
      date: new Date().toUTCString(),
    },
  });

  const foundDatecheck = await client.checkDate.findFirst({
    where: {
      id: datecheck.id,
    },
  });

  logger.info(`Connection checked at ${foundDatecheck?.date}`);
}

execute();
