import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { contactOperation } from "@/server/contact-operation";
import type { ContactProps } from "./types";

export function AddContact({
  updateData,
}: {
  updateData: (payload: ContactProps) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>New person</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New person</DialogTitle>
            <DialogDescription>
              Enter information and press Create
            </DialogDescription>
          </DialogHeader>
          <ContactForm
            onClose={() => setOpen(false)}
            updateData={(payload: ContactProps) => updateData(payload)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>New person</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New person</DrawerTitle>
          <DrawerDescription>
            Enter information and press Create
          </DrawerDescription>
        </DrawerHeader>
        <ContactForm
          className="px-4"
          onClose={() => setOpen(false)}
          updateData={(payload: ContactProps) => updateData(payload)}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "The name must be at least 2 characters long.",
  }),
  gender: z.string().refine(
    (value) => {
      return value === "M" || value === "K" || value === "-";
    },
    {
      message: "Gender must be M, F og -",
    },
  ),
  email: z
    .string()
    .email({
      message: "Email is not correct",
    })
    .optional()
    .or(z.literal("")),
});

interface ContactFormProps2 {
  name: string | undefined;
  gender: string | undefined;
  email: string | undefined;
}

function ContactForm({
  updateData,
  onClose,
  className,
}: React.ComponentProps<"form"> & { onClose: () => void } & {
  updateData: (payload: ContactProps) => void;
}) {
  const formFields = [
    { name: "name", label: "Name", placeholder: "Roynd Royndardóttir" },
    { name: "gender", label: "Gender", placeholder: "F" },
    { name: "email", label: "Email", placeholder: "roynd@roynd.fo" },
  ];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      gender: "",
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const contactid = await contactOperation(values, "create");
    toast({
      title: "The contact was created",
    });
    updateData({ contactid, ...values } as ContactProps);
    onClose();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-2 ${className}`}
      >
        {formFields.map((formField) => (
          <FormField
            key={formField.name}
            control={form.control}
            name={formField.name as keyof ContactFormProps2}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>{formField.label}</FormLabel>
                <FormControl>
                  <Input placeholder={formField.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
