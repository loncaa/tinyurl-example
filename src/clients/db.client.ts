import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function execute(prismaQuery: Promise<any>) {
  return prismaQuery
    .then(async () => {
      await prisma.$disconnect();
    })

    .catch(async (e) => {
      console.error(e);

      await prisma.$disconnect();
      process.exit(1);
    });
}

export default prisma;
