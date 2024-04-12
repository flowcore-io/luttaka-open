import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Loader, XIcon } from "lucide-react"
import Link from "next/link"
import { type FC, useState } from "react"
import { toast } from "sonner"
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

export type SelectCompanyFieldProps = {
  value: string
  label: string
  setValue: (value: string) => void
  submit: () => void
}

export const SelectCompanyField: FC<SelectCompanyFieldProps> = ({
  value,
  label,
  setValue,
  submit,
}) => {
  const [search, setSearch] = useState(label)
  const [currentLabel, setCurrentLabel] = useState<string>(label)
  const [fetchQuery, setFetchQuery] = useState<string>("")

  const {
    isLoading,
    data: results,
    refetch,
  } = api.company.search.useQuery({
    name: fetchQuery,
  })

  const handleResultsQuery = useDebouncedCallback(
    // function
    (value: string) => {
      setFetchQuery(value)
    },
    // delay in ms
    300,
  )

  const { isLoading: isCreating, mutateAsync: createCompany } =
    api.company.create.useMutation({
      onSuccess: () => {
        void refetch()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

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
              <Link href={`/companies/${value}`} className={"underline"}>
                {currentLabel}
              </Link>
            ) : (
              "Select Company"
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
            placeholder="Search for company..."
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
              (results ?? []).map((company) => (
                <CommandItem
                  value={company.name}
                  key={company.id}
                  onSelect={() => {
                    setCurrentLabel(company.name)
                    setValue(company.id)
                  }}>
                  {company.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      company.id === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))
            )}
          </CommandGroup>
          {!isLoading && (results ?? []).length === 0 && (
            <CommandGroup>
              <CommandItem
                value={search}
                key={"create"}
                onSelect={async () => {
                  const id = await createCompany({ name: search })
                  toast.success("Company created")
                  setCurrentLabel(search)
                  setValue(id)
                  submit()
                }}>
                {isCreating && <Loader className={"animate-spin"} />}
                Create {search}
              </CommandItem>
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
