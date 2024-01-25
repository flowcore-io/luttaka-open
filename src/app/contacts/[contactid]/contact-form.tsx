"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { contact } from "@prisma/client";
import { getContact } from "@/server/get-contacts";
import { contactOperation } from "@/server/contact-operation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  contactid: z.string(),
  name: z.string().min(2, {
    message: "The name must be at least two characters long.",
  }),
  gender: z.string().optional(),
  email: z.string().optional(),
});

export function ContactForm({ params }: { params: { contactid: string } }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contactid: params.contactid,
    },
  });

  const [data, setData] = useState<contact>();
  useEffect(() => {
    const fetchData = async () => {
      const contact = await getContact(params.contactid);
      return contact;
    };
    fetchData()
      .then((contact) => {
        setData(contact);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    await contactOperation(values, "update");
    toast({
      title: "Contact information was saved",
    });
  }

  if (!data) return <div>Loading...</div>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          defaultValue={data?.name ?? ""}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Roynd Royndardóttir" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          defaultValue={data?.gender ?? ""}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Input placeholder="F" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          defaultValue={data?.email ?? ""}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="roynd@roynd.fo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isDirty}>
          Goym
        </Button>
      </form>
    </Form>
  );
}
