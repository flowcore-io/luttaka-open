import { retry } from "radash"

/**
 * Waits for a predicate to be satisfied by repeatedly calling an entry function.
 *
 * @param entry - The function that returns a promise to be evaluated.
 * @param predicate - The function that determines if the result satisfies the condition.
 * @param times - The maximum number of times to retry the entry function. Default is 20.
 * @param delay - The delay in milliseconds between each retry. Default is 250ms.
 * @returns A promise that resolves when the predicate is satisfied or rejects if the maximum retries are reached.
 */
export default async function waitForPredicate<T>(
  entry: () => Promise<T>,
  predicate: (result: T) => boolean,
  times = 20,
  delay = 250,
) {
  await retry({ times, delay }, async () => {
    const result = await entry()
    if (predicate(result)) {
      return
    }
    throw new Error("Retry")
  })
}
