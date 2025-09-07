-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "solutionUrl" TEXT,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);
