"use client"

import {type FC, useCallback} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {type z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {UpdateUserProfileDto} from "@/dtos/profile/update-profile.dto";
import {type UserProfileDto} from "@/dtos/profile/user-profile.dto";
import {Textarea} from "@/components/ui/textarea";
import {api} from "@/trpc/react";

export type UserProfileProps = {
  user: UserProfileDto;
}

export const UserProfileForm: FC<UserProfileProps> = ({user}) => {

  const updateUser = api.user.update.useMutation();

  const form = useForm<z.infer<typeof UpdateUserProfileDto>>({
    resolver: zodResolver(UpdateUserProfileDto),
    defaultValues: {
      displayName: user.displayName,
      title: user.title,
      company: user.company,
      description: user.description,
      socials: user.socials,
      avatarUrl: user.avatarUrl
    }
  });

  const onSubmit = useCallback((values: z.infer<typeof UpdateUserProfileDto>) => {
    updateUser.mutate(values);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-3"}>
        <FormField
          control={form.control}
          name={"displayName"}
          render={({field}) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder={"display name"} {...field} />
              </FormControl>
              <FormDescription>
                This is the name that people see when they look at your profile
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"title"}
          render={({field}) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder={"your job title"} {...field} />
              </FormControl>
              <FormDescription>
                What do you work as?
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({field}) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder={"description"} {...field} />
              </FormControl>
              <FormDescription>
                A brief description of yourself
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"company"}
          render={({field}) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder={"company name"} {...field} disabled={true}/>
              </FormControl>
              <FormDescription>
                Currently not available.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"socials"}
          render={({field}) => (
            <FormItem>
              <FormLabel>Socials</FormLabel>
              <FormControl>
                <Input placeholder={"social media link"} {...field} />
              </FormControl>
              <FormDescription>
                Your preferred social media presence
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className={"flex justify-end"}>
          <Button type={"submit"}>Update Profile</Button>
        </div>
      </form>
    </Form>
  );
}

