import type { ColumnDef } from "@tanstack/react-table"
import type { PatientData } from "@/types/patient-data"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "./ui/button"

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  
  try {
    // Check if it's in YYYYMMDD format (from CSV)
    if (dateStr.match(/^\d{8}$/)) {
      return `${dateStr.slice(0,4)}/${dateStr.slice(4,6)}/${dateStr.slice(6,8)}`
    }
    
    // Otherwise, try to parse as ISO date
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date')
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    console.error('Date parsing error:', e)
    return dateStr
  }
}

const SortIcon = ({ sort }: { sort: false | "asc" | "desc" }) => {
  if (sort === false) {
    return <ArrowUpDown className="ml-1.5 h-3 w-3 text-muted-foreground/30" />
  } else if (sort === "asc") {
    return <ArrowUp className="ml-1.5 h-3 w-3" />
  } else {
    return <ArrowDown className="ml-1.5 h-3 w-3" />
  }
}

export const columns: ColumnDef<PatientData>[] = [
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Study Date
          <SortIcon sort={column.getIsSorted()} />
        </Button>
      )
    },
    accessorKey: "Study Date",
    cell: ({ row }) => {
      const date = row.getValue("Study Date") as string
      return formatDate(date)
    }
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Patient ID
        <SortIcon sort={column.getIsSorted()} />
      </Button>
    ),
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Study ID
        <SortIcon sort={column.getIsSorted()} />
      </Button>
    ),
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Series
        <SortIcon sort={column.getIsSorted()} />
      </Button>
    ),
    accessorKey: "Series Number",
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Modality
        <SortIcon sort={column.getIsSorted()} />
      </Button>
    ),
    accessorKey: "Modality",
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Birth Date
        <SortIcon sort={column.getIsSorted()} />
      </Button>
    ),
    accessorKey: "Patient Birth Date",
    cell: ({ row }) => {
      const date = row.getValue("Patient Birth Date") as string
      return formatDate(date)
    }
  },
]

