import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export interface ComboboxItem {
  value: string
  label: string
  searchText?: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  renderItem?: (item: ComboboxItem) => React.ReactNode
}

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "No se encontraron resultados",
  disabled = false,
  className,
  renderItem,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    
    return items.filter((item) => {
      const searchIn = item.searchText || item.label
      return searchIn.toLowerCase().includes(search.toLowerCase())
    })
  }, [items, search])

  const selectedItem = items.find((item) => item.value === value)

  const handleSelect = (itemValue: string) => {
    onValueChange?.(itemValue)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedItem && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {selectedItem ? (
            renderItem ? renderItem(selectedItem) : selectedItem.label
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-[300px] shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0"> 
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="max-h-60 overflow-auto">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.value}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  item.value === value && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSelect(item.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    item.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {renderItem ? renderItem(item) : item.label}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
