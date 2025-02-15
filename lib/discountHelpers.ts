import { db } from '@/db/db'
import { DiscountType, Prisma } from '@prisma/client'

export function usableDiscountWhere(bookId: string) {
  return {
    isActive: true,
    AND: [
      {
        OR: [{ allBooks: true }, { books: { some: { id: bookId } } }],
      },
      { OR: [{ limit: null }, { limit: { gt: db.discount.fields.uses } }] },
      { OR: [{ expiresAt: undefined }, { expiresAt: { gt: new Date() } }] },
    ],
  } satisfies Prisma.DiscountWhereInput
}

export function getDiscountedAmount(
  discount: { discountAmount: number; discountType: DiscountType },
  priceInCents: number
) {
  switch (discount.discountType) {
    case 'PERCENTAGE':
      return Math.max(1, Math.ceil(priceInCents - (priceInCents * discount.discountAmount) / 100))
    case 'FIXED':
      return Math.max(1, Math.ceil(priceInCents - discount.discountAmount * 100))
    default:
      throw new Error(`Invalid discount type ${discount.discountType satisfies never}`)
  }
}
