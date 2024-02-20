import axios from "axios"
import * as process from "process"

export async function sendWebhook<T>(
  aggregator: string,
  event: string,
  data: T,
) {
  const url = [
    process.env.FLOWCORE_WEBHOOK_DOMAIN,
    "event",
    process.env.FLOWCORE_TENANT,
    process.env.FLOWCORE_DATACORE,
    aggregator,
    event,
  ].join("/")
  await axios.post(url, data, { params: { key: process.env.FLOWCORE_KEY } })
}
