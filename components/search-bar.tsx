import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search patient data..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 focus:ring-0 focus-visible:ring-0 ring-0 focus:ring-offset-0 outline-none"
      />
    </div>
  )
}

