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
  type CreateActivityInput,
  CreateActivityInputDto,
} from "@/contracts/activity/activity"
import { api } from "@/trpc/react"

export type CreateActivityProps = {
  close: () => void
  refetch: () => void
}

export const CreateActivityForm: FC<CreateActivityProps> = ({
  close,
  refetch,
}) => {
  const createActivity = api.activity.create.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Activity create failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<CreateActivityInput>({
    resolver: zodResolver(CreateActivityInputDto),
    defaultValues: {
      title: "",
      imageUrl: "",
      description: "",
      stageName: "",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      publicVisibility: false,
      archived: false,
      reason: "",
    },
  })

  const [hasTime, setHasTime] = useState(true)

  const onSubmit = useCallback(async (values: CreateActivityInput) => {
    try {
      await createActivity.mutateAsync(values)
      toast.success("Activity created")
      refetch()
      close()
    } catch (error) {
      console.error("Error in createActivity.mutateAsync", error)
    }
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder={"Title"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input placeholder={"imageUrl"} {...field} />
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
                    value={field.value ?? ""}
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
          name={"stageName"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage</FormLabel>
              <FormControl>
                <Input placeholder={"Main stage"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"startTime"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>Start time</FormLabel>
              <FormControl>
                <div>
                  <DateTimePicker
                    onChange={(value) => {
                      field.onChange(value.date.toISOString())
                      setHasTime(value.hasTime)
                      if (value.date > new Date(form.watch("endTime"))) {
                        form.setValue("endTime", value.date.toISOString())
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
          name={"endTime"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>End Time</FormLabel>
              <FormControl>
                <div>
                  <DateTimePicker
                    onChange={(value) => {
                      field.onChange(value.date.toISOString())
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
          <Button type={"submit"} disabled={createActivity.isLoading}>
            {createActivity.isLoading && <Loader className={"animate-spin"} />}
            Create Activity
          </Button>
        </div>
      </form>
    </Form>
  )
}
