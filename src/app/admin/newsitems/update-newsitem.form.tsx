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
      imageBase64: newsitem.imageBase64,
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
        imageBase64:
          newsitem.imageBase64 !== values.imageBase64
            ? values.imageBase64
            : undefined,
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
          name={"introText"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Introtext</div>
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
          name={"fullText"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Longer text</div>
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
          name={"publishedAt"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Published at</div>
              </FormLabel>
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
