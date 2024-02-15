"use client"

import {Button} from "@/components/ui/button";
import {createTicket, getTickets} from "@/services/ticket";
import {useAuth} from "@clerk/nextjs";
import {useEffect, useState} from "react";

export default function Tickets() {
  const {isLoaded, userId, sessionId, getToken} = useAuth();
  const [tickets, setTickets] = useState<{ id: string }[]>([]);
  useEffect(() => {
    if (!userId) return;
    getTickets(userId).then((tickets) => {
      setTickets(tickets)
    }).catch((error) => console.error(error))
  }, [userId]);

  if (!isLoaded || !userId) return null;

  return (
    <main className="mx-auto w-full">
      <div className="text-center text-slate-400">
        <Button onClick={async () => {
          await createTicket(userId)
        }}>Create ticket</Button>
      </div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="text-center text-slate-400">
          {ticket.id}
        </div>
      ))}
    </main>
  );
}
