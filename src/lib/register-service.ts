// Register service to avoid connection leaking during hot reloads
export const registerService = <T>(name: string, initFn: () => T): T => {
  if (process.env.NODE_ENV === "development") {
    if (!(name in global)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      global[name] = initFn()
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return global[name] as T
  }
  return initFn()
}
