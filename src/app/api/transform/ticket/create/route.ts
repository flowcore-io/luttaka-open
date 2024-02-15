import {db} from "@/database"; 
import {tickets} from "@/database/schemas/tickets"; 
import {SourceEventDto} from "@/dtos/source-event.dto"; 
import {z} from "zod";

const TicketCreateDto = z.object({
  ticketId: z.string().uuid(),
  userId: z.string(),
  state: z.string(),
});

export async function POST(request: Request) {
  try {
    if (request.headers.get("X-Secret") !== process.env.TRANSFORMER_SECRET) {
      return new Response(null, {status: 401})
    }
    const event = SourceEventDto.parse(await request.json())
    const payload = TicketCreateDto.parse(event.payload)
    await db.insert(tickets).values({
      id: payload.ticketId,
      userId: payload.userId,
      state: payload.state
    })
    return new Response(null, {status: 201})
  } catch (error) {
    console.error('Error occurred:', error)
    return new Response(null, {status: 400})
  }
}