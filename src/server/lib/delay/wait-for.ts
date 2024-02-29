import { retry } from "radash"

const NUMBER_OF_ATTEMPTS = 6
const DELAY_BETWEEN_ATTEMPTS = 250

/**
 * Asynchronously waits for a method to return a specific result that satisfies the expected condition.
 * @param method A function that returns a Promise representing the method to be executed.
 * @param expected A function that takes the result of the method as input and returns a boolean indicating whether the result meets the expected condition.
 * @returns A Promise that resolves to the result of the method if it meets the expected condition, otherwise resolves to undefined.
 */
export async function waitFor<T>(
  method: () => Promise<T>,
  expected: (result: T) => boolean,
): Promise<T | undefined> {
  let finalResult: T | undefined = undefined

  await retry(
    { times: NUMBER_OF_ATTEMPTS, delay: DELAY_BETWEEN_ATTEMPTS },
    async () => {
      const result = await method()

      if (expected(result)) {
        finalResult = result
        return
      }
      throw new Error("Retry")
    },
  )

  return finalResult
}
