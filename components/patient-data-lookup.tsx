"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { DataTable } from "@/components/data-table"
import { Sidebar } from "@/components/sidebar"
import { columns } from "@/components/columns"
import { usePatientData } from "@/hooks/use-patient-data"
import type { PatientData } from "@/types/patient-data"

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
    <div className="flex h-[calc(100vh-3.5rem)] gap-4 p-6">
      <div className="flex-1 overflow-hidden">
        <div className="relative group">
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

