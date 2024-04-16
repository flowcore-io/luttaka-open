import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { type FC, useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  type UpdateUserProfileInput,
  UpdateUserProfileInputDto,
} from "@/contracts/profile/user-profile"
import { api } from "@/trpc/react"

import { SelectUserField } from "./select-user-field"

export type AddAdminProps = {
  close: () => void
  refetch: () => void
  filterAway: { userId: string }[]
}

export const AddAdminForm: FC<AddAdminProps> = ({
  close,
  refetch,
  filterAway,
}) => {
  const apiAddAdmin = api.profile.addAdmin.useMutation({
    onError: (error) => {
      const title = error instanceof Error ? error.message : "Add admin failed"
      toast.error(title)
      close()
    },
  })

  const form = useForm<UpdateUserProfileInput>({
    resolver: zodResolver(UpdateUserProfileInputDto),
    defaultValues: {
      userId: "",
    },
  })

  const onSubmit = useCallback(async () => {
    const valuesToSubmit = form.getValues()
    await apiAddAdmin.mutateAsync(valuesToSubmit)
    toast.success("Administrator added successfully")
    refetch()
    close()
  }, [refetch, close])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors, company) => {
          console.log("errors", errors, company)
          toast.error(`Failed to add admin with ${JSON.stringify(errors)}`)
        })}
        className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"userId"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>User</div>
              </FormLabel>
              <FormControl>
                <div>
                  <SelectUserField
                    value={field.value}
                    setValue={field.onChange}
                    label={""}
                    filterAway={filterAway}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={"flex justify-end"}>
          <Button type={"submit"} disabled={apiAddAdmin.isLoading}>
            {apiAddAdmin.isLoading && <Loader className={"animate-spin"} />}
            Add Administrator
          </Button>
        </div>
      </form>
    </Form>
  )
}
