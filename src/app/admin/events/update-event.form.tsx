import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { type FC, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
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
  type EventProfile,
  type UpdateEventInput,
  UpdateEventInputDto,
} from "@/contracts/event/event"
import { api } from "@/trpc/react"
import Image from "next/image"

export type UpdateEventProps = {
  event: EventProfile
  close: () => void
  refetch: () => void
}

export const UpdateEventForm: FC<UpdateEventProps> = ({
  event,
  close,
  refetch,
}) => {
  const updateEvent = api.event.update.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Event update failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<UpdateEventInput>({
    resolver: zodResolver(UpdateEventInputDto),
    defaultValues: {
      id: event.id,
      name: event.name,
      slug: event.slug,
      imageBase64: event.imageBase64,
      description: event.description,
      ticketDescription: event.ticketDescription,
      startDate: event.startDate,
      endDate: event.endDate,
    },
  })

  const [hasTime, setHasTime] = useState(true)

  const onSubmit = useCallback(
    async (values: UpdateEventInput) => {
      if (
        event.startDate !== values.startDate ||
        event.endDate !== values.endDate
      ) {
        if (
          new Date(values.startDate ?? event.startDate) >
          new Date(values.endDate ?? event.endDate)
        ) {
          form.setError("startDate", {
            type: "manual",
            message: "Start date must be before end date",
          })
          return
        }
      }

      const valuesToSubmit: UpdateEventInput = {
        id: event.id,
        name: event.name !== values.name ? values.name : undefined,
        slug:
          event.slug !== values.slug
            ? createSlug(values.slug ?? "")
            : undefined,
        imageBase64:
          event.imageBase64 !== values.imageBase64
            ? values.imageBase64
            : undefined,
        description:
          event.description !== values.description
            ? values.description
            : undefined,
        ticketDescription:
          event.ticketDescription !== values.ticketDescription
            ? values.ticketDescription
            : undefined,
        startDate:
          event.startDate !== values.startDate ? values.startDate : undefined,
        endDate: event.endDate !== values.endDate ? values.endDate : undefined,
      }

      await updateEvent.mutateAsync(valuesToSubmit)
      toast.success("Event Updated")
      refetch()
      close()
    },
    [event],
  )

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors, event) => {
          console.log("errors", errors, event)
          toast.error(`Failed to update event with ${JSON.stringify(errors)}`)
        })}
        className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={"event name"}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.setValue("slug", createSlug(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"slug"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder={"slug"}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    form.setValue("slug", createSlug(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageBase64"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormMessage>
                  {field.value && (
                    <Image
                      src={field.value}
                      width="250"
                      height="250"
                      alt="Decorative"
                    />
                  )}
                </FormMessage>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0]
                        if (file) {
                          if (file.size > 4 * 1024 * 1024) {
                            toast.error(
                              "The size of the file must be less than 4MB",
                            )
                            return
                          }
                          const allowedFileTypes = [
                            "image/jpeg",
                            "image/png",
                            "image/gif",
                            "image/webp",
                            "image/svg+xml",
                          ]
                          if (!allowedFileTypes.includes(file.type)) {
                            toast.error(
                              "The file must be an image (jpg, png, gif, webp, svg)",
                            )
                            return
                          }
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            const base64 = reader.result
                            field.onChange(base64)
                          }
                          reader.readAsDataURL(file)
                        } else {
                          toast.error("No file found")
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Description</div>
              </FormLabel>
              <FormControl>
                <div>
                  <MarkdownEditor
                    name={field.name}
                    value={field.value!}
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

        <FormField
          control={form.control}
          name={"startDate"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Start Date</div>
              </FormLabel>
              <FormControl>
                <div>
                  <DateTimePicker
                    onChange={(value) => {
                      field.onChange(value.date.toISOString())
                      setHasTime(value.hasTime)
                      if (
                        value.date >
                        new Date(form.watch("endDate") ?? event.endDate)
                      ) {
                        form.setValue("endDate", value.date.toISOString())
                      }
                    }}
                    value={{
                      date: new Date(field.value ?? event.startDate),
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
              <FormLabel asChild>
                <div>End Date</div>
              </FormLabel>
              <FormControl>
                <div>
                  <DateTimePicker
                    onChange={(value) => {
                      field.onChange(value.date.toISOString())
                      setHasTime(value.hasTime)
                    }}
                    value={{
                      date: new Date(field.value ?? event.endDate),
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
          <Button type={"submit"} disabled={updateEvent.isLoading}>
            {updateEvent.isLoading && <Loader className={"animate-spin"} />}
            Update Event
          </Button>
        </div>
      </form>
    </Form>
  )
}
