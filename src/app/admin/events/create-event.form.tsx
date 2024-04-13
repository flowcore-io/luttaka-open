import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import Image from "next/image"
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
  type CreateEventInput,
  CreateEventInputDto,
} from "@/contracts/event/event"
import { api } from "@/trpc/react"

export type CreateEventProps = {
  close: () => void
  refetch: () => void
}

export const CreateEventForm: FC<CreateEventProps> = ({ close, refetch }) => {
  const createEvent = api.event.create.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Event create failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(CreateEventInputDto),
    defaultValues: {
      name: "",
      slug: "",
      imageBase64: "",
      description: "",
      ticketDescription: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
  })

  const [hasTime, setHasTime] = useState(false)

  const onSubmit = useCallback(async (values: CreateEventInput) => {
    form.setValue("slug", createSlug(values.slug))
    if (new Date(values.startDate) > new Date(values.endDate)) {
      form.setError("startDate", {
        type: "manual",
        message: "Start date must be before end date",
      })
      return
    }
    await createEvent.mutateAsync(values)
    toast.success("Event created")
    refetch()
    close()
  }, [])

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
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
              <FormLabel asChild>
                <div>End Date</div>
              </FormLabel>
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
          <Button type={"submit"} disabled={createEvent.isLoading}>
            {createEvent.isLoading && <Loader className={"animate-spin"} />}
            Create Event
          </Button>
        </div>
      </form>
    </Form>
  )
}
