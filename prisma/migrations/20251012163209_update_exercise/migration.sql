/*
  Warnings:

  - You are about to drop the column `aimed_reps` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `aimed_weight` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `completedReps` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `completedSets` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `completedWeight` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `Exercise` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('PLANNED', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_planId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "aimed_reps",
DROP COLUMN "aimed_weight",
DROP COLUMN "completedReps",
DROP COLUMN "completedSets",
DROP COLUMN "completedWeight",
DROP COLUMN "exerciseId",
DROP COLUMN "planId",
DROP COLUMN "sets",
ADD COLUMN     "completedSetsId" INTEGER,
ADD COLUMN     "plannedSetsId" INTEGER,
ADD COLUMN     "workoutId" INTEGER;

-- CreateTable
CREATE TABLE "Set" (
    "id" SERIAL NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "SetType" NOT NULL,
    "plannedForId" INTEGER,
    "completedForId" INTEGER,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_plannedForId_fkey" FOREIGN KEY ("plannedForId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_completedForId_fkey" FOREIGN KEY ("completedForId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
