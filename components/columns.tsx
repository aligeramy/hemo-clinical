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
  // Assuming date format is YYYYMMDD
  return `${dateStr.slice(0,4)}/${dateStr.slice(4,6)}/${dateStr.slice(6,8)}`
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

