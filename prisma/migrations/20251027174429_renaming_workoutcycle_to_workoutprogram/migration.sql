/*
  Warnings:

  - You are about to drop the column `workoutCycleId` on the `Notes` table. All the data in the column will be lost.
  - You are about to drop the column `workoutCycleId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `WorkoutCycle` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `workoutId` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_workoutCycleId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutCycle" DROP CONSTRAINT "WorkoutCycle_noteId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutCycle" DROP CONSTRAINT "WorkoutCycle_userId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "workoutId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "workoutCycleId",
ADD COLUMN     "workoutProgramId" INTEGER;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "workoutCycleId",
ADD COLUMN     "workoutProgramId" INTEGER;

-- DropTable
DROP TABLE "WorkoutCycle";

-- CreateTable
CREATE TABLE "WorkoutProgram" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noteId" INTEGER,

    CONSTRAINT "WorkoutProgram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutProgram_noteId_key" ON "WorkoutProgram"("noteId");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "WorkoutProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutProgram" ADD CONSTRAINT "WorkoutProgram_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutProgram" ADD CONSTRAINT "WorkoutProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
