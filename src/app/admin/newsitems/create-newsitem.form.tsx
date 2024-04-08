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
  type CreateNewsitemInput,
  CreateNewsitemInputDto,
} from "@/contracts/newsitem/newsitem"
import { api } from "@/trpc/react"

export type CreateNewsitemProps = {
  close: () => void
  refetch: () => void
}

export const CreateNewsitemForm: FC<CreateNewsitemProps> = ({
  close,
  refetch,
}) => {
  const createNewsitem = api.newsitem.create.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Newsitem create failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<CreateNewsitemInput>({
    resolver: zodResolver(CreateNewsitemInputDto),
    defaultValues: {
      title: "",
      imageUrl: "",
      introText: "",
      fullText: "",
      publicVisibility: false,
      publishedAt: new Date().toISOString(),
      archived: false,
      reason: "",
    },
  })

  const [hasTime, setHasTime] = useState(false)

  const onSubmit = useCallback(async (values: CreateNewsitemInput) => {
    try {
      await createNewsitem.mutateAsync(values)
      toast.success("Newsitem created")
      refetch()
      close()
    } catch (error) {
      console.error("Error in createNewsitem.mutateAsync", error)
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
          name={"introText"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introtext</FormLabel>
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
          name={"fullText"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full text</FormLabel>
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
          name={"publishedAt"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published at</FormLabel>
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
          <Button type={"submit"} disabled={createNewsitem.isLoading}>
            {createNewsitem.isLoading && <Loader className={"animate-spin"} />}
            Create News Item
          </Button>
        </div>
      </form>
    </Form>
  )
}
