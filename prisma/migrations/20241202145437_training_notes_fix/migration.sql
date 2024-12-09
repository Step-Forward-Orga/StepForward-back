/*
  Warnings:

  - Added the required column `title` to the `TrainingNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingNote" ADD COLUMN     "title" TEXT NOT NULL;
