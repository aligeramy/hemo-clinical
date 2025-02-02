import type { ColumnDef } from "@tanstack/react-table"
import type { PatientData } from "@/types/patient-data"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  
  try {
    // Check if it's in YYYYMMDD format (from CSV)
    if (dateStr.match(/^\d{8}$/)) {
      return `${dateStr.slice(0,4)}/${dateStr.slice(4,6)}/${dateStr.slice(6,8)}`
    }
    
    // If it's an ISO date string
    if (dateStr.includes('T') || dateStr.includes('-')) {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
    
    // If we can't parse it, return the original string
    console.error('Unparseable date:', dateStr)
    return dateStr
  } catch (e) {
    console.error('Date parsing error:', e)
    return dateStr
  }
}

export const columns: ColumnDef<PatientData>[] = [
  {
    header: "Study Date",
    accessorKey: "Study Date",
    cell: ({ row }) => {
      const date = row.getValue("Study Date") as string
      return formatDate(date)
    }
  },
  {
    header: "Patient ID",
    accessorKey: "Patient ID",
    cell: ({ row }) => {
      const id = row.getValue("Patient ID") as string
      if (!id) return ''
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">···{id.slice(-4)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    header: "Study ID",
    accessorKey: "Study ID",
    cell: ({ row }) => {
      const id = row.getValue("Study ID") as string
      if (!id) return ''
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">···{id.slice(-4)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    header: "Series",
    accessorKey: "Series Number",
  },
  {
    header: "Modality",
    accessorKey: "Modality",
  },
  {
    header: "Birth Date",
    accessorKey: "Patient Birth Date",
    cell: ({ row }) => {
      const date = row.getValue("Patient Birth Date") as string
      return formatDate(date)
    }
  },
]

