"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { type FC, useCallback } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import { SelectCompanyField } from "@/app/me/select-company-field"
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
import { Textarea } from "@/components/ui/textarea"
import { UpdateUserProfileInput } from "@/contracts/profile/update-profile-input"
import { type UserProfile } from "@/contracts/profile/user-profile"
import { api } from "@/trpc/react"

export type UserProfileProps = {
  user: UserProfile
}

export const UserProfileForm: FC<UserProfileProps> = ({ user }) => {
  const updateProfile = api.profile.update.useMutation()
  const router = useRouter()

  const form = useForm<z.infer<typeof UpdateUserProfileInput>>({
    resolver: zodResolver(UpdateUserProfileInput),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      company: user.companyId,
      description: user.description,
      socials: user.socials,
      avatarUrl: user.avatarUrl,
    },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof UpdateUserProfileInput>) => {
      await updateProfile.mutateAsync(values)
      router.refresh()
    },
    [],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"firstName"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder={"first name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"lastName"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder={"last name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder={"your job title"} {...field} />
              </FormControl>
              <FormDescription>What do you work as?</FormDescription>
              <FormMessage />
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
                <Textarea placeholder={"description"} {...field} />
              </FormControl>
              <FormDescription>A brief description of yourself</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"company"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Company</div>
              </FormLabel>
              <FormControl>
                <div>
                  <SelectCompanyField
                    value={field.value!}
                    setValue={field.onChange}
                    label={user.company}
                    submit={() => onSubmit(form.getValues())}
                  />
                </div>
              </FormControl>
              <FormDescription>Company you represent</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"socials"}
          render={({ field }) => (
            <FormItem>
              <FormLabel asChild>
                <div>Socials</div>
              </FormLabel>
              <FormControl>
                <Input placeholder={"social media link"} {...field} />
              </FormControl>
              <FormDescription>
                Your preferred social media presence
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={"flex justify-end"}>
          <Button type={"submit"}>Update Profile</Button>
        </div>
      </form>
    </Form>
  )
}
