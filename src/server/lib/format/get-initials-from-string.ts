/**
 * Extracts initials from a string.
 *
 * @param str - The input string.
 * @returns The initials extracted from the string.
 * @example Chandler Murial Bing -> CMB
 */
export const getInitialsFromString = (str: string) => {
  const names = str.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase());
  return initials.join("");
}