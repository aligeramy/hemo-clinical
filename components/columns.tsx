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
    // If it's an ISO date string (e.g., "2024-01-15T00:00:00.000Z")
    if (dateStr.includes('T')) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
    
    // If it's in YYYYMMDD format
    if (dateStr.match(/^\d{8}$/)) {
      const year = dateStr.slice(0, 4)
      const month = dateStr.slice(4, 6)
      const day = dateStr.slice(6, 8)
      return `${month}/${day}/${year}`
    }

    // If it has dashes (YYYY-MM-DD)
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-')
      if (month && day) {
        return `${month}/${day}/${year}`
      }
    }
    
    // If we can't parse it, return original
    console.warn('Unparseable date:', dateStr)
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

