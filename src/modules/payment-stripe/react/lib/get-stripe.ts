"use client"

import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>
const getStripe = () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export default getStripe
