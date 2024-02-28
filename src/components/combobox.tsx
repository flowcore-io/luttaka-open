"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ComboOption {
  value: string
  label: string
}

interface ComboboxProps {
  combooptions: ComboOption[]
  comboname: string
  comboplaceholder: string
  comboempty: string
}

export function Combobox({
  combooptions,
  comboname,
  comboplaceholder,
  comboempty,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {value
            ? combooptions.find((o) => o.value === value)?.label
            : comboname}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={comboplaceholder} />
          <CommandEmpty>{comboempty}</CommandEmpty>
          <CommandGroup>
            {combooptions.map((combooption) => (
              <CommandItem
                value={combooption.label}
                key={combooption.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === combooption.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {combooption.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
