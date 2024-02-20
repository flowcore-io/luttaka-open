export type MiddlewareInput<T> = {
  ctx: {
    auth?: {
      userId: string
    }
  },
  next: () => Promise<T>
}