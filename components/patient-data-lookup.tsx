"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { DataTable } from "@/components/data-table"
import { Sidebar } from "@/components/sidebar"
import { columns } from "@/components/columns"
import { usePatientData } from "@/hooks/use-patient-data"
import type { PatientData } from "@/types/patient-data"
import { Hospital } from "lucide-react"

export function PatientDataLookup() {
  const { data, isLoading, error } = usePatientData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null)

  const filteredData = data?.filter((patient) =>
    Object.values(patient).some((value) => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 p-6">
      <div className="flex-1 space-y-6 overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30">
              <Hospital className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Patient Data Lookup
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {data?.length || 0} studies available
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/50 to-transparent backdrop-blur-sm transition-opacity group-hover:opacity-80" />
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="border rounded-lg bg-background/90 backdrop-blur-sm shadow-sm">
          <DataTable<PatientData>
            columns={columns}
            data={filteredData || []}
            isLoading={isLoading}
            error={error}
            onRowClick={setSelectedPatient}
          />
        </div>
      </div>
      <Sidebar patient={selectedPatient} />
    </div>
  )
}

