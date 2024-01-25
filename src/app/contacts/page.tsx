"use client";

import { getContacts } from "@/server/get-contacts";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import type { ContactProps } from "./types";
import { useOrganizationList } from "@clerk/nextjs";

export default function Contacts() {
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const [superuser, setSuperuser] = useState(false);
  useEffect(() => {
    if (isLoaded) {
      const isSuperuser =
        userMemberships.data?.filter(
          (mem) => mem.organization.slug === "flowcore",
        ).length > 0;
      setSuperuser(!!isSuperuser);
    }
  }, [isLoaded, userMemberships]);
  const [data, setData] = useState<ContactProps[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const contacts = await getContacts();
      const contacts2 = contacts.map((contact) => {
        return {
          contactid: contact.contactid ?? undefined,
          name: contact.name ?? undefined,
          gender: contact.gender ?? undefined,
          email: contact.email ?? undefined,
        };
      });
      return contacts2;
    };
    fetchData()
      .then((contacts2) => {
        setData(contacts2);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const updateData = async (payload: ContactProps) => {
    const contactExists = data.find(
      (contact) => contact.contactid === payload.contactid,
    );
    if (contactExists) {
      const updatedContact = data.map((contact) => {
        if (contact.contactid === payload.contactid) {
          return payload;
        }
        return contact;
      });
      setData(updatedContact);
    } else {
      const newContact = [...data, payload];
      setData(newContact);
    }
  };
  const deleteData = async (contactid: string) => {
    const updatedContact = data.filter((contact) => {
      return contact.contactid !== contactid;
    });
    setData(updatedContact);
  };
  return (
    isLoaded &&
    superuser && (
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={data}
          updateData={(payload: ContactProps) => updateData(payload)}
          deleteData={(contactid: string) => deleteData(contactid)}
        />
      </div>
    )
  );
}
