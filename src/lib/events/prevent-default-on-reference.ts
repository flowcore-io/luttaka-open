/**
 * Prevents default behavior on touchend and click events for the given HTML element reference.
 *
 * @param ref - The HTML element reference on which to prevent default behavior.
 * @returns The modified HTML element reference with default behavior prevention on touchend and click events.
 * @link https://github.com/radix-ui/primitives/issues/1658#issuecomment-1690666012
 */
export const preventDefaultOnReference = (ref: HTMLElement | null) => {
  if (!ref) {
    return
  }

  ref.ontouchend = (e) => {
    e.preventDefault()
  }
  ref.onclick = (e) => {
    e.preventDefault()
  }

  return ref
}
