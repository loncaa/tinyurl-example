import { PrismaClient } from "@prisma/client";
import { createUniqueId } from "../src/commons/shortUrl.utils";
import * as ShortUrlService from "../src/services/shortUrl.service";

const SEED_WEEK_DATA = [
  {
    period: "week",
    value: 1,
    year: 2024,
    counter: 10,
  },
  {
    period: "week",
    value: 2,
    year: 2024,
    counter: 22,
  },
  {
    period: "week",
    value: 3,
    year: 2024,
    counter: 6,
  },
  {
    period: "week",
    value: 4,
    year: 2024,
    counter: 12,
  },
  {
    period: "week",
    value: 5,
    year: 2024,
    counter: 50,
  },
];

const prisma = new PrismaClient();
async function main() {
  const id = "example";
  const fullUrl = "https://example.com";

  await prisma.shortUrl.deleteMany({});
  await prisma.usageStatistic.deleteMany({});

  await ShortUrlService.create(prisma.shortUrl, id, fullUrl);

  await prisma.usageStatistic.createMany({
    data: SEED_WEEK_DATA.map((payload) => ({ ...payload, shortUrlId: id })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
