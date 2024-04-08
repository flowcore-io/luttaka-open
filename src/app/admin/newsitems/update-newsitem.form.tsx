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
  type NewsitemProfile,
  type UpdateNewsitemInput,
  UpdateNewsitemInputDto,
} from "@/contracts/newsitem/newsitem"
import { api } from "@/trpc/react"

export type UpdateNewsitemProps = {
  newsitem: NewsitemProfile
  close: () => void
  refetch: () => void
}

export const UpdateNewsitemForm: FC<UpdateNewsitemProps> = ({
  newsitem,
  close,
  refetch,
}) => {
  const updateNewsitem = api.newsitem.update.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Newsitem update failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<UpdateNewsitemInput>({
    resolver: zodResolver(UpdateNewsitemInputDto),
    defaultValues: {
      id: newsitem.id,
      title: newsitem.title,
      imageUrl: newsitem.imageUrl,
      introText: newsitem.introText,
      fullText: newsitem.fullText,
      publicVisibility: newsitem.publicVisibility,
      publishedAt: newsitem.publishedAt,
    },
  })

  const [hasTime, setHasTime] = useState(true)

  const onSubmit = useCallback(
    async (values: UpdateNewsitemInput) => {
      const valuesToSubmit: UpdateNewsitemInput = {
        id: newsitem.id,
        title: newsitem.title !== values.title ? values.title : undefined,
        imageUrl:
          newsitem.imageUrl !== values.imageUrl ? values.imageUrl : undefined,
        introText:
          newsitem.introText !== values.introText
            ? values.introText
            : undefined,
        fullText:
          newsitem.fullText !== values.fullText ? values.fullText : undefined,
        publicVisibility:
          newsitem.publicVisibility !== values.publicVisibility
            ? values.publicVisibility
            : undefined,
        publishedAt:
          newsitem.publishedAt !== values.publishedAt
            ? values.publishedAt
            : undefined,
      }

      await updateNewsitem.mutateAsync(valuesToSubmit)
      toast.success("Newsitem Updated")
      refetch()
      close()
    },
    [newsitem],
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors, newsitem) => {
          console.log("errors", errors, newsitem)
          toast.error(
            `Failed to update newsitem with ${JSON.stringify(errors)}`,
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
          name={"introText"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introtext</FormLabel>
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
          name={"fullText"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full text</FormLabel>
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
          name={"publishedAt"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published at</FormLabel>
              <FormControl>
                <div>
                  <DateTimePicker
                    onChange={(value) => {
                      field.onChange(value.date.toISOString())
                      setHasTime(value.hasTime)
                    }}
                    value={{
                      date: new Date(field.value ?? newsitem.publishedAt),
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
          <Button type={"submit"} disabled={updateNewsitem.isLoading}>
            {updateNewsitem.isLoading && <Loader className={"animate-spin"} />}
            Update News Item
          </Button>
        </div>
      </form>
    </Form>
  )
}
