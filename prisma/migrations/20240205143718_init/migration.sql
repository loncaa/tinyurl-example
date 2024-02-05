-- CreateTable
CREATE TABLE "ShortUrl" (
    "id" SERIAL NOT NULL,
    "full" TEXT NOT NULL,
    "shorten" TEXT NOT NULL,

    CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckDate" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "CheckDate_pkey" PRIMARY KEY ("id")
);
