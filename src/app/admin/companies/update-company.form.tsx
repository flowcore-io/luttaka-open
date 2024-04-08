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
  type CompanyProfile,
  type UpdateCompanyInput,
  UpdateCompanyInputDto,
} from "@/contracts/company/company"
import { api } from "@/trpc/react"

import { SelectOwnerField } from "./select-owner-field"

export type UpdateCompanyProps = {
  company: CompanyProfile
  close: () => void
  refetch: () => void
}

export const UpdateCompanyForm: FC<UpdateCompanyProps> = ({
  company,
  close,
  refetch,
}) => {
  const updateCompany = api.company.update.useMutation({
    onError: (error) => {
      const title =
        error instanceof Error ? error.message : "Company update failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<UpdateCompanyInput>({
    resolver: zodResolver(UpdateCompanyInputDto),
    defaultValues: {
      id: company.id,
      name: company.name,
      imageUrl: company.imageUrl,
      description: company.description,
      companyType: company.companyType,
    },
  })

  const onSubmit = useCallback(
    async (values: UpdateCompanyInput) => {
      const valuesToSubmit: UpdateCompanyInput = {
        id: company.id,
        name: company.name !== values.name ? values.name : undefined,
        imageUrl:
          company.imageUrl !== values.imageUrl ? values.imageUrl : undefined,
        description:
          company.description !== values.description
            ? values.description
            : undefined,
        companyType:
          company.companyType !== values.companyType
            ? values.companyType
            : undefined,
      }

      await updateCompany.mutateAsync(valuesToSubmit)
      toast.success("Company Updated")
      refetch()
      close()
    },
    [company],
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors, company) => {
          console.log("errors", errors, company)
          toast.error(`Failed to update company with ${JSON.stringify(errors)}`)
        })}
        className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={"Company name"} {...field} />
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
                <MarkdownEditor
                  name={field.name}
                  value={field.value!}
                  onChange={field.onChange}
                />
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
          <Button type={"submit"} disabled={updateCompany.isLoading}>
            {updateCompany.isLoading && <Loader className={"animate-spin"} />}
            Update Company
          </Button>
        </div>
      </form>
    </Form>
  )
}
