"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CreateProductInput {
  conferenceId: string
  id: string
  name: string
  description: string
  price: number
  currency: string
}

export async function createProduct(input: CreateProductInput) {
  const priceCents = input.price * 100
  await stripe.prices.create({
    currency: input.currency,
    unit_amount: priceCents,
    lookup_key: `standard_${input.id}`,
    product_data: {
      id: input.id,
      name: input.name,
      metadata: {
        conferenceId: input.conferenceId,
      },
    },
  })
}

interface UpdateProductInput {
  id: string
  name?: string
  description?: string
  price?: number
  currency?: string
}

export async function updateProduct(input: UpdateProductInput) {
  console.log("update product", input)
  if (input.name ?? input.description) {
    await stripe.products.update(input.id, {
      name: input.name,
      description: input.description,
    })
  }
  if (input.price && input.currency) {
    const price = await getPrice(input.id)
    const priceCents = input.price * 100
    if (price.unit_amount !== priceCents || price.currency !== input.currency) {
      await stripe.prices.create({
        product: input.id,
        currency: input.currency,
        unit_amount: priceCents,
        lookup_key: `standard_${input.id}`,
        transfer_lookup_key: true,
      })
      await stripe.prices.update(price.id, {
        active: false,
      })
    }
  }
}

export async function archiveProduct(id: string) {
  await stripe.products.update(id, {
    active: false,
  })
}

export async function getPrice(productId: string) {
  const prices = await stripe.prices.list({
    lookup_keys: [`standard_${productId}`],
  })
  const price = prices.data[0]
  if (!price) {
    throw new Error("Price not found")
  }
  return price
}
