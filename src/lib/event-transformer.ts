import type { NextRequest } from "next/server"
import { isArray } from "radash"

import {
  EventDto,
  EventMetadataDto,
  type EventMetdata,
} from "@/contracts/common"

interface Domain {
  flowType: string
  eventType: Record<string, string>
}

type Transformer = (payload: unknown, metadata?: EventMetdata) => Promise<void>

type Transformers<T extends string = string> = Record<
  T,
  Transformer | Transformer[]
>

export default class EventTransformer {
  constructor(
    private domain: Domain,
    private transformers: Transformers,
  ) {}

  async post(request: NextRequest) {
    try {
      if (request.headers.get("X-Secret") !== process.env.TRANSFORMER_SECRET) {
        return Response.json({ success: false }, { status: 401 })
      }

      await this.transform(await request.json())
      return Response.json({ success: true }, { status: 200 })
    } catch (error) {
      console.error("Error occurred:", error)
      return Response.json({ success: false }, { status: 400 })
    }
  }

  async transform(rawEvent: unknown): Promise<void> {
    const event = EventDto.parse(rawEvent)
    if (event.aggregator !== this.domain.flowType) {
      throw new Error("Invalid flowType")
    }

    const key = this.getEventTypeKey(event.eventType)
    if (!key) {
      throw new Error("Invalid eventType")
    }
    const transformer = this.transformers[key]
    if (!transformer) {
      throw new Error("No transformer found")
    }

    const metadata = EventMetadataDto.parse(event)

    if (isArray(transformer)) {
      console.log("transformer", transformer)
      const results = await Promise.allSettled(
        transformer.map((t) => t(event.payload, metadata)),
      )

      for (const result of results) {
        if (result.status === "rejected") {
          console.error(`Error occurred: `, result.reason)
        }
      }
      return
    }

    await transformer(event.payload, metadata)
  }

  getEventTypeKey(eventType: string): string | undefined {
    return Object.keys(this.domain.eventType).find(
      (key) => this.domain.eventType[key] === eventType,
    )
  }
}
