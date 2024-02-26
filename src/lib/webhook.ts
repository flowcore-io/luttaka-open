import axios from "axios"
import * as process from "process"

async function sendWebhook<T>(aggregator: string, event: string, data: T) {
  const url = [
    process.env.FLOWCORE_WEBHOOK_BASEURL,
    "event",
    process.env.FLOWCORE_TENANT,
    process.env.FLOWCORE_DATACORE,
    aggregator,
    event,
  ].join("/")
  try {
    await axios.post(url, data, { params: { key: process.env.FLOWCORE_KEY } })
  } catch (error) {
    console.error(
      "Failed to send webhook",
      error instanceof Error ? error.message : error,
    )
    throw new Error("Failed to send webhook")
  }
}

export function webhookFactory<T>(aggregator: string, event: string) {
  return (data: T) => sendWebhook<T>(aggregator, event, data)
}
