import { type MouseEvent } from "react"

/**
 * Stops the propagation of the event and executes the provided method.
 * @param method - The method to execute.
 * @returns A function that stops event propagation and executes the provided method.
 */
export const stopPropagation =
  (method: () => void) => (e: MouseEvent | TouchEvent) => {
    e.stopPropagation()
    method()
  }
