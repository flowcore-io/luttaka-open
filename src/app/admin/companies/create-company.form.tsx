import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
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
      imageUrl: "",
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
