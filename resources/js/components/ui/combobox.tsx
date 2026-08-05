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
  onCreateNew?: (query: string) => void
  createNewLabel?: (query: string) => string
  // Where to portal the dropdown. Pass the enclosing Dialog's content element
  // when this Combobox is used inside a Dialog — see PopoverContent's
  // `container` prop for why this is needed for scroll to work there.
  portalContainer?: HTMLElement | null
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
  onCreateNew,
  createNewLabel = (query) => `Crear "${query}"`,
  portalContainer,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])

  const filteredItems = React.useMemo(() => {
    if (!search) return items

    return items.filter((item) => {
      const searchIn = item.searchText || item.label
      return searchIn.toLowerCase().includes(search.toLowerCase())
    })
  }, [items, search])

  // La lista filtrada cambia con cada tecla — siempre resaltar la primera
  // opción para que Enter/flechas tengan un punto de partida consistente.
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredItems])

  React.useEffect(() => {
    if (!open) return
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" })
  }, [open, highlightedIndex])

  const selectedItem = items.find((item) => item.value === value)

  const handleSelect = (itemValue: string) => {
    onValueChange?.(itemValue)
    setOpen(false)
    setSearch("")
  }

  const handleCreateNew = () => {
    onCreateNew?.(search)
    setOpen(false)
    setSearch("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((i) => Math.min(i + 1, filteredItems.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filteredItems[highlightedIndex]
      if (item) {
        handleSelect(item.value)
      } else if (onCreateNew && search) {
        handleCreateNew()
      }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) setSearch("")
      }}
    >
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
      <PopoverContent
        align="start"
        container={portalContainer}
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>
        <div className="max-h-60 overflow-auto overscroll-contain">
          {filteredItems.length === 0 ? (
            onCreateNew && search ? (
              <div
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-primary outline-none hover:bg-accent"
                onClick={handleCreateNew}
              >
                {createNewLabel(search)}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            )
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.value}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  item.value === value && "bg-accent text-accent-foreground",
                  index === highlightedIndex && "bg-accent text-accent-foreground"
                )}
                onMouseEnter={() => setHighlightedIndex(index)}
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
