/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PatientData } from "@/types/patient-data"
import { cn } from "@/lib/utils"

interface SidebarProps {
  patient: PatientData | null
}

// Priority fields in order of clinical relevance
const priorityFields = [
  "Patient Name",
  "Patient Age",
  "Patient Sex",
  "Study Description",
  "Study Date",
  "Study Time",
  "Modality",
  "Body Part",
  "Patient ID",
  "Study ID",
  "Patient Birth Date",
  "Institution Name",
] as const

// Technical fields that come after
const technicalFields = [
  "Series Number",
  "Series Description",
  "Protocol Name",
  "Slice Thickness",
  "KVP",
  "Pixel Spacing",
  "Image Type",
  "Instance Number",
  "Manufacturer",
  "SOP Instance UID",
  "Series Instance UID",
  "Study Instance UID",
  "Accession Number",
] as const

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return `${dateStr.slice(0,4)}/${dateStr.slice(4,6)}/${dateStr.slice(6,8)}`
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  return `${timeStr.slice(0,2)}:${timeStr.slice(2,4)}:${timeStr.slice(4,6)}`
}

const formatValue = (key: string, value: any): string => {
  if (value === null || value === undefined || value === '') return 'N/A'
  
  // Format dates
  if (key === 'Study Date' || key === 'Patient Birth Date') {
    return formatDate(value)
  }
  
  // Format times
  if (key === 'Study Time') {
    return formatTime(value)
  }
  
  // Format arrays (like Pixel Spacing)
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  
  return String(value)
}

export function Sidebar({ patient }: SidebarProps) {
  if (!patient) {
    return (
      <div className="w-80 rounded-lg border bg-card p-6">
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center text-sm text-muted-foreground">
          Select a patient to view details
        </div>
      </div>
    )
  }

  const renderFields = (fields: readonly string[], isHighPriority: boolean = false) => {
    return fields.map((key) => {
      if (!(key in patient)) return null
      const value = patient[key as keyof PatientData]
      return (
        <div 
          key={key} 
          className={cn(
            "space-y-1 rounded-md p-2.5",
            "bg-black/[0.03] hover:bg-black/[0.05] transition-colors",
            isHighPriority && "bg-black/[0.04]"
          )}
        >
          <p className="text-sm font-medium leading-none">{key}</p>
          <p className="text-sm text-muted-foreground">
            {formatValue(key, value)}
          </p>
        </div>
      )
    })
  }

  return (
    <div className="w-80 rounded-lg border bg-card p-6">
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-6">
          {/* Clinical Priority Information */}
          <div className="space-y-3">
            <h3 className="font-semibold tracking-tight px-2.5">Clinical Information</h3>
            {renderFields(priorityFields, true)}
          </div>
          
          {/* Technical Details */}
          <div className="space-y-3">
            <h3 className="font-semibold tracking-tight text-muted-foreground px-2.5">Technical Details</h3>
            {renderFields(technicalFields)}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

