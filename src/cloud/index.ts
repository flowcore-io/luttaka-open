import { LuttakaPaymentStripe } from "@/modules/payment-stripe/server"

export const payment = new LuttakaPaymentStripe({
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_SECRET_KEY!,
})
