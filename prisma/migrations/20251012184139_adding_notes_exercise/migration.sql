/*
  Warnings:

  - A unique constraint covering the columns `[noteId]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "noteId" INTEGER;

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "exerciseId" INTEGER,
ADD COLUMN     "workoutCycleId" INTEGER,
ADD COLUMN     "workoutId" INTEGER,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "note" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_noteId_key" ON "Exercise"("noteId");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
