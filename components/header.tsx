"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LogOut, Hospital } from "lucide-react"
import { usePatientData } from "@/hooks/use-patient-data"

export function Header() {
  const { data } = usePatientData()

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center gap-x-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30">
              <Hospital className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex flex-col">
            <div className="font-semibold">Medical Imaging Archive</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs -mt-1">
              {data?.length || 0} studies available
            </span>
            </div>
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  )
}