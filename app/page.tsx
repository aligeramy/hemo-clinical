import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { PatientDataLookup } from "@/components/patient-data-lookup"

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="container mx-auto p-4">
      <PatientDataLookup />
    </main>
  )
}

