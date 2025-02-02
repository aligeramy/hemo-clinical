/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  isLoading: boolean
  error: Error | null
  onRowClick: (row: TData) => void
  selectedPatient?: TData | null
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  error,
  onRowClick,
  selectedPatient,
}: DataTableProps<TData>) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.ceil(data.length / pageSize)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  const currentData = data.slice(start, end)

  useEffect(() => {
    setCurrentPage(1)
  }, [data])

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <AlertCircle className="mr-2 h-4 w-4" />
        <span>Error loading data</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="rounded-md bg-background p-3">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : currentData.length ? (
              currentData.map((row, index) => {
                const isSelected = JSON.stringify(row) === JSON.stringify(data.find(d => 
                  JSON.stringify(d) === JSON.stringify(selectedPatient)
                ))
                return (
                  <TableRow
                    key={index}
                    onClick={() => onRowClick(row)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isSelected 
                        ? "!bg-black hover:!bg-black focus:!bg-black" 
                        : "hover:bg-muted/50",
                    )}
                  >
                    {table
                      .getRowModel()
                      .rows[start + index]
                      .getVisibleCells()
                      .map((cell) => (
                        <TableCell 
                          key={cell.id}
                          className={cn(
                            "transition-colors",
                            isSelected && "!text-white"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="flex items-center justify-between px-6 py-3 border-t -mb-2">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Page</span>
            <span className="font-medium">{currentPage}</span>
            <span className="text-muted-foreground">of</span>
            <span className="font-medium">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentPage(1)
              }}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1))
              }}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 px-2 min-w-[5rem] justify-center">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (value >= 1 && value <= totalPages) {
                    setCurrentPage(value)
                  }
                }}
                className="w-12 h-8 rounded-md border border-input bg-transparent px-2 text-sm text-center focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
              }}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentPage(totalPages)
              }}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

