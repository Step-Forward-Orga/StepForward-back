/*
  Warnings:

  - You are about to drop the column `exerciceId` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `exerciseId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "exerciceId",
ADD COLUMN     "exerciseId" TEXT NOT NULL;
