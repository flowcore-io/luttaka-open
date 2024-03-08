import { type FormEvent, type TouchEvent } from "react"

/**
 * A higher-order function that prevents the default behavior of the event and then calls the provided method.
 * @param method - The method to call after preventing default behavior.
 * @returns A function that takes an event and prevents its default behavior before calling the method.
 */
export const preventDefault =
  (method: () => void) => (e: FormEvent | TouchEvent | MouseEvent) => {
    e.preventDefault()
    method()
  }
