import { Separator } from "@/components/ui/separator";
import { ContactForm } from "./contact-form";

export default function ContactPage({
  params,
}: {
  params: { contactid: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contact</h3>
        <p className="text-sm text-muted-foreground">
          Update information about the contact.
        </p>
      </div>
      <Separator />
      <ContactForm params={params} />
    </div>
  );
}
