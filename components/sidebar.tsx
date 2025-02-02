/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PatientData } from "@/types/patient-data"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "./ui/button"
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react"

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

const formatValue = (key: string, value: any): { text: string, isUID: boolean } => {
  if (value === null || value === undefined || value === '') 
    return { text: 'N/A', isUID: false }
  
  // Check if field is a UID
  const isUID = key.includes('UID')
  
  // Format dates
  if (key === 'Study Date' || key === 'Patient Birth Date') {
    return { text: formatDate(value), isUID: false }
  }
  
  // Format times
  if (key === 'Study Time') {
    return { text: formatTime(value), isUID: false }
  }
  
  // Format arrays (like Pixel Spacing)
  if (Array.isArray(value)) {
    return { text: value.join(', '), isUID: false }
  }
  
  return { text: String(value), isUID }
}

export function Sidebar({ patient }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!patient) {
    return (
      <div className={cn(
        "rounded-lg border bg-card p-6 transition-all duration-300",
        isExpanded ? "w-full" : "w-[350px]"
      )}>
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center text-sm text-muted-foreground">
          Select a patient to view details
        </div>
      </div>
    )
  }

  const renderFields = (fields: readonly string[], isHighPriority: boolean = false) => {
    return (
      <div className={cn(
        "grid gap-4",
        isExpanded ? "grid-cols-3" : "grid-cols-1"
      )}>
        {fields.map((key) => {
          if (!(key in patient)) return null
          const value = patient[key as keyof PatientData]
          const formattedValue = formatValue(key, value)
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
              <p className={cn(
                "text-muted-foreground",
                formattedValue.isUID ? "text-[9px]" : "text-sm"
              )}>
                {formattedValue.text}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn(
      "rounded-lg border bg-card transition-all duration-300 relative",
      isExpanded ? "w-full" : "w-[350px]"
    )}>
     
      <div className="p-6">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-6">
            {/* Clinical Priority Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold tracking-tight px-2.5">Clinical Information</h3>
                
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ArrowRightFromLine className="h-4 w-4" />
          ) : (
            <ArrowLeftFromLine className="h-4 w-4" />
          )}
        </Button>
              </div>
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
    </div>
  )
}

