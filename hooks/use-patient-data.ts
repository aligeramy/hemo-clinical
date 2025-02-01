import { useState, useEffect } from "react"
import type { PatientData } from "@/types/patient-data"

export function usePatientData() {
  const [data, setData] = useState<PatientData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/patient-data")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

