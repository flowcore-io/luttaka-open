"use server";

import { api } from "@/trpc/server";
import type { contact } from "@prisma/client";

async function getContact(contactid: string): Promise<contact> {
  return (await api.contact.get.query(contactid))!;
}

async function getContacts(): Promise<contact[]> {
  return await api.contact.list.query();
}

export { getContact, getContacts };
