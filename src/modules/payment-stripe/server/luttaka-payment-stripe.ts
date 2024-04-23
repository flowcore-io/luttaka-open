"server-only"

import Stripe from "stripe"

import { type CreateProductInput } from "./contracts/create-product"
import { type CreateSessionInput } from "./contracts/create-session-input"
import { type LuttakaPaymentStripeOptions } from "./contracts/luttaka-payment-stripe-options"
import { type UpdateProductInput } from "./contracts/update-product"

type Metadata = Record<string, string | number | null>

export class LuttakaPaymentStripe {
  public readonly stripe: Stripe

  constructor(private readonly options: LuttakaPaymentStripeOptions) {
    this.stripe = new Stripe(this.options.secretKey)
  }

  async createProduct<T extends CreateProductInput>(input: T) {
    const { price, currency, id, name, ...metadata } = input

    const priceCents = price * 100
    await this.stripe.prices.create({
      currency: currency,
      unit_amount: priceCents,
      lookup_key: `standard_${id}`,
      product_data: {
        id: id,
        name: name,
        metadata: metadata as Metadata,
      },
    })
  }

  async createSessionId(options: CreateSessionInput) {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          quantity: options.quantity,
          price: options.priceId,
        },
      ],
      allow_promotion_codes: true,
      client_reference_id: options.userId,
      customer_email: options.emailAddress,
      metadata: options.metadata,
      mode: "payment",
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
    })
    return session.id
  }

  createWebhookEvent(content: string, stripeSignature: string) {
    return this.stripe.webhooks.constructEvent(
      content,
      stripeSignature,
      this.options.webhookSecret,
    )
  }

  async updateProduct(input: UpdateProductInput) {
    if (input.name ?? input.description) {
      await this.stripe.products.update(input.id, {
        name: input.name,
        description: input.description,
      })
    }
    if (input.price && input.currency) {
      const price = await this.getPrice(input.id)
      const priceCents = input.price * 100
      if (
        price.unit_amount !== priceCents ||
        price.currency !== input.currency
      ) {
        await this.stripe.prices.create({
          product: input.id,
          currency: input.currency,
          unit_amount: priceCents,
          lookup_key: `standard_${input.id}`,
          transfer_lookup_key: true,
        })
        await this.stripe.prices.update(price.id, {
          active: false,
        })
      }
    }
  }

  async archiveProduct(id: string) {
    await this.stripe.products.update(id, {
      active: false,
    })
  }

  async getPrice(productId?: string) {
    const prices = await this.stripe.prices.list({
      lookup_keys: [`standard_${productId}`],
    })
    const price = prices.data[0]
    if (!price) {
      throw new Error("Price not found")
    }
    return price
  }

  async tryGetPrice(productId?: string) {
    try {
      return {
        data: await this.getPrice(productId),
        error: "",
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          data: null,
          error: error.message,
        }
      }

      return {
        data: null,
        error: JSON.stringify(error),
      }
    }
  }
}
