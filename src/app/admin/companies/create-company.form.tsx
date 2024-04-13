import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import Image from "next/image"
import { type FC, useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { MarkdownEditor } from "@/components/md-editor"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  type CreateCompanyInput,
  CreateCompanyInputDto,
} from "@/contracts/company/company"
import { api } from "@/trpc/react"

import { SelectOwnerField } from "./select-owner-field"

export type CreateCompanyProps = {
  close: () => void
  refetch: () => void
}

export const CreateCompanyForm: FC<CreateCompanyProps> = ({
  close,
  refetch,
}) => {
  const createCompany = api.company.create.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Company create failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(CreateCompanyInputDto),
    defaultValues: {
      name: "",
      imageBase64: "",
      description: "",
      owner: "",
      companyType: "default",
    },
  })

  const onSubmit = useCallback(async (values: CreateCompanyInput) => {
    try {
      await createCompany.mutateAsync(values)
      toast.success("Company created")
      refetch()
      close()
    } catch (error) {
      console.error("Error in createCompany.mutateAsync", error)
    }
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"name"}
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
          name={"companyType"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Company type</div>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="default" id="default" />
                    </FormControl>
                    <Label htmlFor="default">Default</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="exhibitor" id="exhibitor" />
                    </FormControl>
                    <Label htmlFor="exhibitor">Exhibitor</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="sponsor" id="sponsor" />
                    </FormControl>
                    <Label htmlFor="sponsor">Sponsor</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"owner"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Owner</div>
              </FormLabel>
              <FormControl>
                <div>
                  <SelectOwnerField
                    value={field.value!}
                    setValue={field.onChange}
                    label={""}
                    submit={() => onSubmit(form.getValues())}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={"flex justify-end"}>
          <Button type={"submit"} disabled={createCompany.isLoading}>
            {createCompany.isLoading && <Loader className={"animate-spin"} />}
            Create Company
          </Button>
        </div>
      </form>
    </Form>
  )
}
