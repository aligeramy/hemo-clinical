/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
} from "@tanstack/react-table"

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
  // Helper functions first
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

  // State and other hooks
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [sorting, setSorting] = useState<SortingState>([
    { id: "Study Date", desc: true }
  ])

  const itemsPerPage = 10

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  // Fix useMemo dependencies
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return table.getRowModel().rows.slice(start, start + itemsPerPage)
  }, [currentPage, itemsPerPage, table])

  const totalPages = Math.ceil(table.getRowModel().rows.length / itemsPerPage)

  const handleRowClick = useCallback((row: TData, index: number) => {
    setSelectedIndex(index)
    onRowClick(row)
  }, [onRowClick])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null && e.key.startsWith('Arrow')) {
        setSelectedIndex(0)
        onRowClick(data[0])
        return
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (selectedIndex! > 0) {
            const newIndex = selectedIndex! - 1
            setSelectedIndex(newIndex)
            onRowClick(data[newIndex])
          } else if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
            setSelectedIndex(itemsPerPage - 1)
          }
          break
          
        case 'ArrowDown':
          e.preventDefault()
          if (selectedIndex! < data.length - 1) {
            const newIndex = selectedIndex! + 1
            setSelectedIndex(newIndex)
            onRowClick(data[newIndex])
          } else if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
            setSelectedIndex(0)
          }
          break
          
        case 'ArrowLeft':
          if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
            setSelectedIndex(null)
          }
          break
          
        case 'ArrowRight':
          if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
            setSelectedIndex(null)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, data, selectedIndex, onRowClick, itemsPerPage])

  if (isLoading) return (
    <div className="rounded-md shadow-lg ring-1 ring-white/10 overflow-hidden bg-background/80 backdrop-blur-lg text-sm">
      <Table>
        <TableHeader className="text-md">
          <TableRow className="bg-muted overflow-hidden hover:bg-transparent">
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
          {[...Array(10)].map((_, i) => (
            <TableRow key={i}>
              {columns.map((column, j) => (
                <TableCell 
                  key={`${i}-${j}`}
                  className="[&:first-child]:pl-8"
                >
                  <Skeleton className="h-4 w-[80%]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

  return (
    <div className="rounded-md shadow-lg ring-1 ring-white/10 overflow-hidden bg-background/80 backdrop-blur-lg text-sm">
      <Table>
        <TableHeader className="text-md">
          <TableRow className="bg-muted overflow-hidden hover:bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  className="font-medium text-muted-foreground [&:first-child]:pl-8"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow 
              key={row.id} 
              onClick={() => handleRowClick(row.original, index)}
              className={cn(
                "cursor-pointer transition-all text-[13px]",
                selectedIndex === index 
                  ? "bg-black text-white hover:bg-black/80" 
                  : "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50",
                "[&:last-child]:border-b-0"
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell 
                  key={cell.id}
                  className="[&:first-child]:pl-8"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between text-xs px-8 py-1 border-t">
        <div className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentPage(1)
              setSelectedIndex(null)
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
              setSelectedIndex(null)
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
              setSelectedIndex(null)
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
              setSelectedIndex(null)
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

