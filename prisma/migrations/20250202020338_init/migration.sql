-- CreateTable
CREATE TABLE "PatientStudy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "patientBirthDate" TEXT NOT NULL,
    "accessionNumber" TEXT NOT NULL,
    "studyInstanceUid" TEXT NOT NULL,
    "seriesInstanceUid" TEXT NOT NULL,
    "sopInstanceUid" TEXT NOT NULL,
    "studyDate" TIMESTAMP(3) NOT NULL,
    "studyTime" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "studyDescription" TEXT NOT NULL,
    "seriesNumber" TEXT NOT NULL,
    "sliceThickness" TEXT,
    "imageType" TEXT,
    "instanceNumber" INTEGER,
    "kvp" TEXT,
    "pixelSpacing" TEXT,
    "protocolName" TEXT,
    "patientSex" TEXT NOT NULL,
    "patientAge" TEXT,
    "patientWeight" TEXT,

    CONSTRAINT "PatientStudy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PatientStudy_patientId_idx" ON "PatientStudy"("patientId");

-- CreateIndex
CREATE INDEX "PatientStudy_studyDate_idx" ON "PatientStudy"("studyDate");

-- CreateIndex
CREATE INDEX "PatientStudy_modality_idx" ON "PatientStudy"("modality");
