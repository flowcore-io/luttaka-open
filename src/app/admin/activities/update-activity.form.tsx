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
  type ActivityProfile,
  type UpdateActivityInput,
  UpdateActivityInputDto,
} from "@/contracts/activity/activity"
import { api } from "@/trpc/react"

export type UpdateActivityProps = {
  activity: ActivityProfile
  close: () => void
  refetch: () => void
}

export const UpdateActivityForm: FC<UpdateActivityProps> = ({
  activity,
  close,
  refetch,
}) => {
  const updateActivity = api.activity.update.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Activity update failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<UpdateActivityInput>({
    resolver: zodResolver(UpdateActivityInputDto),
    defaultValues: {
      id: activity.id,
      title: activity.title,
      imageUrl: activity.imageUrl,
      description: activity.description,
      stageName: activity.stageName,
      startTime: activity.startTime,
      endTime: activity.endTime,
      publicVisibility: activity.publicVisibility,
    },
  })

  const [hasTime, setHasTime] = useState(true)

  const onSubmit = useCallback(
    async (values: UpdateActivityInput) => {
      const valuesToSubmit: UpdateActivityInput = {
        id: activity.id,
        title: activity.title !== values.title ? values.title : undefined,
        imageUrl:
          activity.imageUrl !== values.imageUrl ? values.imageUrl : undefined,
        description:
          activity.description !== values.description
            ? values.description
            : undefined,
        stageName:
          activity.stageName !== values.stageName
            ? values.stageName
            : undefined,
        startTime:
          activity.startTime !== values.startTime
            ? values.startTime
            : undefined,
        endTime:
          activity.endTime !== values.endTime ? values.endTime : undefined,
        publicVisibility:
          activity.publicVisibility !== values.publicVisibility
            ? values.publicVisibility
            : undefined,
      }

      await updateActivity.mutateAsync(valuesToSubmit)
      toast.success("Activity Updated")
      refetch()
      close()
    },
    [activity],
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors, activity) => {
          console.log("errors", errors, activity)
          toast.error(
            `Failed to update activity with ${JSON.stringify(errors)}`,
          )
        })}
        className={"space-y-3"}>
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
                      if (
                        value.date >
                        new Date(form.watch("endTime") ?? activity.endTime)
                      ) {
                        form.setValue("endTime", value.date.toISOString())
                      }
                      setHasTime(value.hasTime)
                    }}
                    value={{
                      date: new Date(field.value ?? activity.startTime),
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
                      date: new Date(field.value ?? activity.endTime),
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
          <Button type={"submit"} disabled={updateActivity.isLoading}>
            {updateActivity.isLoading && <Loader className={"animate-spin"} />}
            Update Activity
          </Button>
        </div>
      </form>
    </Form>
  )
}
