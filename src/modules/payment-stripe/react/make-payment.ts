"use client"

import { z } from "zod"

import { type PaymentResult } from "./contracts/payment-result"
import getStripe from "./lib/get-stripe"

const CheckoutShape = z.object({
  sessionId: z.string(),
})

export async function makePayment<T extends object>(
  payload: T,
): Promise<PaymentResult> {
  const stripe = await getStripe()
  if (!stripe) {
    return {
      error: "Failed to redirect to checkout",
      success: false,
    }
  }

  // todo: hallow - specify endpoint
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  const session = CheckoutShape.parse(await response.json())
  const result = await stripe.redirectToCheckout({
    sessionId: session.sessionId,
  })

  if (result.error) {
    return {
      error: "Failed to redirect to checkout",
      success: false,
    }
  }

  return {
    error: "",
    success: true,
  }
}
