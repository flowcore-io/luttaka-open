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
      imageBase64: "",
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
              <FormLabel asChild>
                <div>Longer text</div>
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
