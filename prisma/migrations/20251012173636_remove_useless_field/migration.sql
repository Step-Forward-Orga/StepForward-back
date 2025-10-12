/*
  Warnings:

  - You are about to drop the column `completedSetsId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `plannedSetsId` on the `Exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "completedSetsId",
DROP COLUMN "plannedSetsId";
