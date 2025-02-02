/*
  Warnings:

  - Added the required column `seriesDescription` to the `PatientStudy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyId` to the `PatientStudy` table without a default value. This is not possible if the table is not empty.
  - Made the column `protocolName` on table `PatientStudy` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PatientStudy" ADD COLUMN     "seriesDescription" TEXT NOT NULL,
ADD COLUMN     "studyId" TEXT NOT NULL,
ALTER COLUMN "protocolName" SET NOT NULL;
