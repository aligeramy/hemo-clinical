import useSWR from 'swr'
import { decrypt } from '@/lib/encryption'
import type { PatientData } from '@/types/patient-data'

interface EncryptedPatientStudy {
  id: string
  createdAt: string
  updatedAt: string
  patientName: string
  patientId: string
  patientBirthDate: string
  accessionNumber: string
  studyInstanceUid: string
  seriesInstanceUid: string
  sopInstanceUid: string
  studyDate: string
  studyTime: string
  modality: string
  bodyPart: string
  institutionName: string
  manufacturer: string
  studyDescription: string
  seriesDescription: string
  studyId: string
  seriesNumber: string
  sliceThickness: string | null
  imageType: string | null
  instanceNumber: number | null
  kvp: string | null
  pixelSpacing: string | null
  protocolName: string | null
  patientSex: string
  patientAge: string | null
  patientWeight: string | null
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.text()
    throw error
  }
  return res.json()
}

const formatDateString = (dateStr: string) => {
  if (!dateStr) return ''
  
  // If it's in YYYYMMDD format, convert to YYYY-MM-DD
  if (dateStr.match(/^\d{8}$/)) {
    return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`
  }
  return dateStr
}

export function usePatientData() {
  const { data, error, isLoading } = useSWR<EncryptedPatientStudy[]>('/api/patient-studies', fetcher)
  
  const decryptedData: PatientData[] | undefined = data?.map((study) => ({
    'Patient Name': decrypt(study.patientName),
    'Patient ID': decrypt(study.patientId),
    'Patient Birth Date': decrypt(study.patientBirthDate),
    'Accession Number': decrypt(study.accessionNumber),
    'Study Instance UID': decrypt(study.studyInstanceUid),
    'Series Instance UID': decrypt(study.seriesInstanceUid),
    'SOP Instance UID': decrypt(study.sopInstanceUid),
    'Study Date': new Date(study.studyDate).toISOString(),
    'Study Time': study.studyTime,
    'Modality': study.modality,
    'Body Part': study.bodyPart,
    'Institution Name': study.institutionName,
    'Manufacturer': study.manufacturer,
    'Study Description': study.studyDescription,
    'Series Description': study.seriesDescription || '',
    'Study ID': study.studyId || '',
    'Series Number': study.seriesNumber,
    'Slice Thickness': study.sliceThickness || '',
    'Image Type': study.imageType || '',
    'Instance Number': study.instanceNumber || 0,
    'KVP': study.kvp || '',
    'Pixel Spacing': study.pixelSpacing || '',
    'Protocol Name': study.protocolName || '',
    'Patient Sex': study.patientSex,
    'Patient Age': study.patientAge || '',
    'Patient Weight': study.patientWeight || '',
  }))

  return { 
    data: decryptedData, 
    error, 
    isLoading 
  }
}

