const CURRENCY_FORMATTER = new Intl.NumberFormat('uk-UA', {
  currency: 'UAH',
  style: 'currency',
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: any) {
  return CURRENCY_FORMATTER.format(amount)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('uk-UA')

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}
