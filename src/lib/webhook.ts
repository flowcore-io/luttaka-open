import axios from "axios"
import * as process from "process"

/**
 * Sends a webhook to the specified aggregator and event.
 * @param aggregator - The aggregator to send the webhook to.
 * @param event - The event to trigger on the aggregator.
 * @param data - The data to send with the webhook.
 * @returns A promise that resolves when the webhook is sent successfully.
 * @throws An error if the webhook fails to send.
 */
export async function sendWebhook<T>(
  aggregator: string,
  event: string,
  data: T,
) {
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

/**
 * Creates a webhook factory function.
 *
 * @param aggregator - The aggregator for the webhook.
 * @param event - The event for the webhook.
 * @returns A function that sends a webhook with the specified aggregator, event, and data.
 * @template T - The type of data to be sent in the webhook.
 */
export function webhookFactory<T>(aggregator: string, event: string) {
  return (data: T) => sendWebhook<T>(aggregator, event, data)
}
