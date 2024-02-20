import { ticket } from "@/contracts/events/ticket"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import axios from "axios"

const EventDto = z.object({
  eventId: z.string(),
  aggregator: z.string(),
  eventType: z.string(),
  validTime: z.string(),
  payload: z.any(),
})

export async function POST(request: NextRequest) {
  try {
    const json: unknown = await request.json()
    const body = EventDto.parse(json)
    if (body.aggregator === ticket.flowType) {
      await axios.post("http://localhost:3000/api/transform/ticket", body, {
        headers: {
          "X-Secret": process.env.TRANSFORMER_SECRET,
        },
      })
    }
    return new NextResponse(null, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error occurred:", error.message)
    }

    return new NextResponse(null, { status: 400 })
  }
}
