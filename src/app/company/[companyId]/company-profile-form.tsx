"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { type FC, useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { MarkdownEditor } from "@/components/md-editor"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  type UpdateCompanyInput,
  UpdateCompanyInputDto,
} from "@/contracts/company/company"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/shared"

export type CompanyProfileProps = {
  company: NonNullable<RouterOutputs["company"]["get"]>
}

export const CompanyProfileForm: FC<CompanyProfileProps> = ({ company }) => {
  const { isLoading, mutateAsync: updateCompany } =
    api.company.update.useMutation()
  const router = useRouter()

  const form = useForm<UpdateCompanyInput>({
    resolver: zodResolver(UpdateCompanyInputDto),
    defaultValues: {
      id: company.id,
      name: company.name,
      description: company.description ?? "",
    },
  })

  const onSubmit = useCallback(async (values: UpdateCompanyInput) => {
    await updateCompany(values)
    toast.success("Company profile updated")
    router.refresh()
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder={"company name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <MarkdownEditor
                  name={field.name}
                  value={field.value!}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                A brief description of the company
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={"flex justify-end"}>
          <Button onClick={() => router.replace(`/company/${company.id}`)}>
            View Profile
          </Button>
          <Button disabled={isLoading} type={"submit"} className={"ml-2"}>
            {isLoading && <Loader className={"animate-spin"} />}
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  )
}
