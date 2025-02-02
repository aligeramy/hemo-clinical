"use client"

import { useState, useCallback, useMemo } from "react"
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

  const filteredData = useMemo(() => {
    return data?.filter((patient: PatientData) =>
      Object.values(patient).some((value) => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm])

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setSelectedPatient(null)
  }, [])

  const handleRowClick = useCallback((patient: PatientData) => {
    setSelectedPatient(patient)
  }, [])

  return (
    <div className="flex gap-4 p-6 pb-0">
      <div className="flex-1 overflow-hidden">
        <div className="relative group">
          <SearchBar value={searchTerm} onChange={handleSearch} />
        </div>

        <div className="border rounded-lg bg-background/90 backdrop-blur-sm shadow-sm">
          <DataTable<PatientData>
            columns={columns}
            data={filteredData || []}
            isLoading={isLoading}
            error={error}
            onRowClick={handleRowClick}
            selectedPatient={selectedPatient}
          />
        </div>
      </div>
      <Sidebar patient={selectedPatient} />
    </div>
  )
}

