/*
  Warnings:

  - You are about to drop the column `solutionUrl` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Contest` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `platform` on the `Contest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('codeforces', 'codechef', 'leetcode');

-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "solutionUrl",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "solutionLink" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "platform",
ADD COLUMN     "platform" "Platform" NOT NULL;

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_contestId_key" ON "Bookmark"("userId", "contestId");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
