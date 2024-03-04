import { zodResolver } from "@hookform/resolvers/zod"
import currencyCodes from "currency-codes"
import { Loader } from "lucide-react"
import { type FC, useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import { toast } from "sonner"

import { MarkdownEditor } from "@/components/md-editor"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type CreateConferenceInput,
  CreateConferenceInputDto,
} from "@/contracts/conference/conference"
import { api } from "@/trpc/react"

export type CreateConferenceProps = {
  close: () => void
  refetch: () => void
}

export const CreateConferenceForm: FC<CreateConferenceProps> = ({
  close,
  refetch,
}) => {
  const createConference = api.conference.create.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Conference create failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<CreateConferenceInput>({
    resolver: zodResolver(CreateConferenceInputDto),
    defaultValues: {
      name: "",
      description: "",
      ticketDescription: "",
      ticketCurrency: "USD",
      ticketPrice: 0.0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  })

  const [hasTime, setHasTime] = useState(false)

  const onSubmit = useCallback(async (values: CreateConferenceInput) => {
    if (new Date(values.startDate) > new Date(values.endDate)) {
      form.setError("startDate", {
        type: "manual",
        message: "Start date must be before end date",
      })
      return
    }
    await createConference.mutateAsync(values)
    toast.success("Conference created")
    refetch()
    close()
  }, [])

  const codes = useMemo(() => {
    return currencyCodes.data.map((code) => {
      return {
        label: `${code.code} - ${code.currency}`,
        value: code.code,
      }
    })
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conference Name</FormLabel>
              <FormControl>
                <Input placeholder={"conference name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div>
                  <MarkdownEditor
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"ticketDescription"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Description</FormLabel>
              <FormControl>
                <Input placeholder={"ticket description"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name={"ticketPrice"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <NumericFormat
                      placeholder={"price"}
                      value={field.value}
                      onValueChange={(value) =>
                        field.onChange({
                          target: {
                            value: value.floatValue,
                            name: field.name,
                          },
                        })
                      }
                      customInput={Input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {codes.map((code) => (
                          <SelectItem value={code.value} key={code.value}>
                            {code.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name={"ticketCurrency"}
              control={form.control}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name={"startDate"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <div>
                  <DateTimePicker
                    onChange={(value) => {
                      field.onChange({
                        target: {
                          value: value.date.toISOString(),
                          name: field.name,
                        },
                      })
                      setHasTime(value.hasTime)
                      if (value.date > new Date(form.watch("endDate"))) {
                        form.setValue("endDate", value.date.toISOString())
                      }
                    }}
                    value={{
                      date: new Date(field.value),
                      hasTime: hasTime,
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"endDate"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <div>
                  <DateTimePicker
                    onChange={(value) => {
                      field.onChange({
                        target: {
                          value: value.date.toISOString(),
                          name: field.name,
                        },
                      })
                      setHasTime(value.hasTime)
                    }}
                    value={{
                      date: new Date(field.value),
                      hasTime: hasTime,
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={"flex justify-end"}>
          <Button type={"submit"} disabled={createConference.isLoading}>
            {createConference.isLoading && (
              <Loader className={"animate-spin"} />
            )}
            Create Conference
          </Button>
        </div>
      </form>
    </Form>
  )
}
