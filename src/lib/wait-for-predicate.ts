import { retry } from "radash"

export default async function waitForPredicate<T>(
  entry: () => Promise<T>,
  predicate: (result: T) => boolean,
) {
  await retry({ times: 20, delay: 250 }, async () => {
    const result = await entry()
    if (predicate(result)) {
      return
    }
    throw new Error("Retry")
  })
}
