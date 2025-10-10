/*
  Warnings:

  - You are about to drop the column `reps` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the `TrainingNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aimed_reps` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aimed_weight` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_planId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingNote" DROP CONSTRAINT "TrainingNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutPlan" DROP CONSTRAINT "WorkoutPlan_trainingNoteId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutPlan" DROP CONSTRAINT "WorkoutPlan_userId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "reps",
DROP COLUMN "weight",
ADD COLUMN     "aimed_reps" INTEGER NOT NULL,
ADD COLUMN     "aimed_weight" INTEGER NOT NULL,
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completedReps" INTEGER,
ADD COLUMN     "completedSets" INTEGER,
ADD COLUMN     "completedWeight" INTEGER,
ALTER COLUMN "restTime" DROP NOT NULL;

-- DropTable
DROP TABLE "TrainingNote";

-- DropTable
DROP TABLE "WorkoutPlan";

-- CreateTable
CREATE TABLE "Notes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noteId" INTEGER,
    "workoutCycleId" INTEGER,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutCycle" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noteId" INTEGER,

    CONSTRAINT "WorkoutCycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workout_noteId_key" ON "Workout"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutCycle_noteId_key" ON "WorkoutCycle"("noteId");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_workoutCycleId_fkey" FOREIGN KEY ("workoutCycleId") REFERENCES "WorkoutCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutCycle" ADD CONSTRAINT "WorkoutCycle_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutCycle" ADD CONSTRAINT "WorkoutCycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
