import { DiscountType } from '@prisma/client'

const CURRENCY_FORMATTER = new Intl.NumberFormat('uk-UA', {
  currency: 'USD',
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

const PERCENT_FORMATTER = new Intl.NumberFormat('uk-UA', { style: 'percent' })

export function formatDiscount({
  discountAmount,
  discountType,
}: {
  discountAmount: number
  discountType: DiscountType
}) {
  switch (discountType) {
    case 'PERCENTAGE':
      return PERCENT_FORMATTER.format(discountAmount / 100)
    case 'FIXED':
      return formatCurrency(discountAmount)
    default:
      throw new Error(`Invalid discount code type ${discountType satisfies never}`)
  }
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDateTime(date: Date) {
  return DATE_TIME_FORMATTER.format(date)
}
