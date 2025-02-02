/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { useState, useMemo, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  isLoading: boolean
  error: Error | null
  onRowClick: (row: TData) => void
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  error,
  onRowClick,
}: DataTableProps<TData>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const itemsPerPage = 10
  const totalPages = Math.ceil(data.length / itemsPerPage)
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  }, [data, currentPage])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => {
            const newIndex = Math.max(0, prev - 1)
            if (newIndex < 0 && currentPage > 1) {
              setCurrentPage(prev => prev - 1)
              return itemsPerPage - 1
            }
            return newIndex
          })
          break
          
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => {
            const newIndex = Math.min(paginatedData.length - 1, prev + 1)
            if (newIndex >= itemsPerPage && currentPage < totalPages) {
              setCurrentPage(prev => prev + 1)
              return 0
            }
            return newIndex
          })
          break
          
        case 'ArrowLeft':
          if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
            setSelectedIndex(0)
          }
          break
          
        case 'ArrowRight':
          if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
            setSelectedIndex(0)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, paginatedData.length, itemsPerPage])

  // Update selected row when index changes
  useEffect(() => {
    if (paginatedData[selectedIndex]) {
      onRowClick(paginatedData[selectedIndex])
    }
  }, [selectedIndex, paginatedData, onRowClick])

  if (isLoading) return (
    <div className="space-y-4 p-6">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-[42px] w-full rounded-lg" />
      ))}
    </div>
  )
  
  if (error) return (
    <div className="p-6 text-center space-y-4">
      <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
      <p className="text-red-500 text-sm">{error.message}</p>
    </div>
  )

  if (!data?.length) return (
    <div className="p-6 text-center space-y-4">
      <Stethoscope className="h-8 w-8 mx-auto text-muted-foreground" />
      <p className="text-muted-foreground text-sm">No studies found</p>
    </div>
  )

  const getCellContent = (column: ColumnDef<TData, any>, rowData: TData) => {
    if (typeof column.cell === 'function') {
      return column.cell({
        row: {
          getValue: (key: string) => (rowData as any)[key],
          original: rowData,
        },
        getValue: () => (rowData as any)[(column as any).accessorKey],
        renderValue: () => (rowData as any)[(column as any).accessorKey],
      } as any)
    }

    return (rowData as any)[(column as any).accessorKey]
  }

  const renderHeader = (column: ColumnDef<TData, any>) => {
    if (typeof column.header === 'function') {
      return column.header({
        column: column as any,
        header: column as any,
        table: {
          getCoreRowModel: () => ({ rows: [] }),
          getFilteredRowModel: () => ({ rows: [] }),
          getGroupedRowModel: () => ({ rows: [] }),
          getPaginationRowModel: () => ({ rows: [] }),
          getSortedRowModel: () => ({ rows: [] }),
          options: { data: [] },
          setOptions: () => {},
          reset: () => {},
          getState: () => ({}),
          setState: () => {},
        } as any,
      })
    }
    return column.header as string
  }

  return (
    <div className="rounded-md border bg-background/80 backdrop-blur-lg text-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-transparent hover:bg-transparent">
            {columns.map((column) => (
              <TableHead 
                key={column.id}
                className="font-medium text-muted-foreground [&:first-child]:pl-8"
              >
                {renderHeader(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow 
              key={index} 
              onClick={() => {
                setSelectedIndex(index)
                onRowClick(row)
              }}
              className={cn(
                "cursor-pointer transition-colors text-[13px]",
                selectedIndex === index 
                  ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                  : "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50",
                "[&:last-child]:border-b-0"
              )}
            >
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  className="[&:first-child]:pl-8"
                >
                  {getCellContent(column, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentPage(1)
              setSelectedIndex(0)
            }}
            disabled={currentPage === 1}
            className="rounded-lg"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentPage(prev => Math.max(1, prev - 1))
              setSelectedIndex(0)
            }}
            disabled={currentPage === 1}
            className="rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1))
              setSelectedIndex(0)
            }}
            disabled={currentPage === totalPages}
            className="rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentPage(totalPages)
              setSelectedIndex(0)
            }}
            disabled={currentPage === totalPages}
            className="rounded-lg"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

