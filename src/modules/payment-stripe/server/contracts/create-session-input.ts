export type CreateSessionInput = {
  quantity: number
  userId: string
  priceId: string
  emailAddress?: string
  metadata: Record<string, string | number | null>
  successUrl: string
  cancelUrl: string
}
