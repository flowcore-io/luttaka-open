"use server"

import {db} from '@/database'
import {tickets} from "@/database/schemas/tickets"; 
import {sendWebhook} from "@/lib/webhook";
import {eq} from "drizzle-orm";
import {v4 as uuid} from 'uuid';

export async function getTickets(userId: string) {
  return db.query.tickets.findMany({
    where: eq(tickets.userId, userId)
  })
}

export async function createTicket(userId: string) {
  const ticketId: string = uuid()
  try {
    await sendWebhook('ticket.0', 'create.0', {userId, ticketId, state: 'open'})
    return ticketId
  } catch (error) {
    console.error('Error occurred:', error)
    return null
  }
}