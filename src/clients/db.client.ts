import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient<any> | null = null;

export function getDbClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}
