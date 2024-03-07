"use client"

import { ArrowBigRightDash, TicketIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import RedeemTicketsDialog from "@/app/me/tickets/redeem-ticket.dialog"
import { Ticket } from "@/app/me/tickets/ticket.component"
import TransferTicketsDialog from "@/app/me/tickets/ticket-transfer.dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"

export default function Tickets() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: tickets, refetch } = api.ticket.list.useQuery()
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  useEffect(() => {
    const success = searchParams.get("success")
    if (success === "true") {
      toast.success("Ticket purchased")
      router.replace(pathname)
    } else if (success === "false") {
      toast.info("Ticket purchase cancelled")
      router.replace(pathname)
    }
  }, [])

  const onSelect = (ticketId: string) => (selected: boolean) => {
    const selectedTicketIds = selectedTickets.filter((id) => id !== ticketId)
    if (selected) {
      setSelectedTickets([...selectedTicketIds, ticketId])
    } else {
      setSelectedTickets(selectedTicketIds)
    }
  }

  return (
    <main className="mx-auto w-full">
      <div className="pb-8 md:flex">
        <div className="mb-4 text-3xl font-bold text-slate-900">My tickets</div>
        <div className="whitespace-nowrap md:mt-4 md:flex-1 md:text-right">
          {selectedTickets.length > 0 && (
            <TransferTicketsDialog
              ticketIds={selectedTickets}
              onDone={() => refetch()}>
              <Button className={"mr-2"}>
                <ArrowBigRightDash className={"mr-2"} />
                Transfer tickets
              </Button>
            </TransferTicketsDialog>
          )}
          <RedeemTicketsDialog onDone={() => refetch()}>
            <Button variant={"secondary"}>
              <TicketIcon className={"mr-2"} /> Redeem ticket
            </Button>
          </RedeemTicketsDialog>
        </div>
      </div>

      {tickets?.map((ticket) => (
        <Ticket
          key={ticket.id}
          selected={selectedTickets.includes(ticket.id)}
          onSelect={onSelect(ticket.id)}
          ticket={ticket}
          refetch={async () => {
            await refetch()
          }}
        />
      ))}
    </main>
  )
}
