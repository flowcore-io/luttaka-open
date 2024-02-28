/**
 * A TypeScript utility type used in Next.js pages.
 * @typeparam T - T represents the shape of the parameters that would be received from a URL in a Next.js page.
 * @property params - An object that consists of URL parameters in Next.js.
 */
export type WithUrlParams<T extends object> = { params: T }
