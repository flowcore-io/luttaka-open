export function formatCurrency(
  value: number,
  currency: string,
  locale = "da-DK",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value)
}
