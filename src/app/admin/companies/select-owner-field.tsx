import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Loader, XIcon } from "lucide-react"
import Link from "next/link"
import { type FC, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { FormControl } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"

export type SelectOwnerFieldProps = {
  value: string
  label: string
  setValue: (value: string) => void
  submit: () => void
}

export const SelectOwnerField: FC<SelectOwnerFieldProps> = ({
  value,
  label,
  setValue,
}) => {
  const [search, setSearch] = useState(label)
  const [currentLabel, setCurrentLabel] = useState<string>(label)
  const [fetchQuery, setFetchQuery] = useState<string>("")

  const { isLoading, data: results } = api.profile.search.useQuery({
    firstName: fetchQuery,
  })

  const handleResultsQuery = useDebouncedCallback(
    // function
    (value: string) => {
      setFetchQuery(value)
    },
    // delay in ms
    300,
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[300px] justify-between",
              !value && "text-muted-foreground",
            )}>
            {currentLabel ? (
              <Link href={`/profile/${value}`} className={"underline"}>
                {currentLabel}
              </Link>
            ) : (
              "Select User"
            )}
            {currentLabel && (
              <XIcon
                className="ml-auto h-4 w-4"
                onClick={() => {
                  setCurrentLabel("")
                  setValue("")
                }}
              />
            )}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search for profile..."
            value={search}
            onValueChange={(value) => {
              setSearch(value)
              handleResultsQuery(value)
            }}
            className="h-9"
          />
          <CommandGroup>
            {isLoading ? (
              <Loader className={"animate-spin"} />
            ) : (
              (results ?? []).map((profile) => (
                <CommandItem
                  value={profile.firstName ?? ""}
                  key={profile.id}
                  onSelect={() => {
                    setCurrentLabel(profile.firstName ?? "")
                    setValue(profile.id)
                  }}>
                  {profile.firstName}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      profile.id === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
