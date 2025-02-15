'use server'

import { db } from '@/db/db'
import { DiscountType } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'
import { z } from 'zod'

const addSchema = z
  .object({
    code: z.string().min(1),
    discountAmount: z.coerce.number().int().min(1),
    discountType: z.nativeEnum(DiscountType),
    allBooks: z.coerce.boolean(),
    bookIds: z.array(z.string()).optional(),
    expiresAt: z.preprocess((value) => (value === '' ? undefined : value), z.coerce.date().min(new Date()).optional()),
    limit: z.preprocess((value) => (value === '' ? undefined : value), z.coerce.number().int().min(1).optional()),
  })
  .refine((data) => data.discountAmount <= 100 || data.discountType !== DiscountType.PERCENTAGE, {
    message: 'Percentage discount must be less than or equal to 100',
    path: ['discountAmount'],
  })
  .refine((data) => !data.allBooks || data.bookIds == null, {
    message: 'Cannot select products when all products is selected',
    path: ['bookIds'],
  })
  .refine((data) => data.allBooks || data.bookIds != null, {
    message: 'Must select products when all products is not selected',
    path: ['bookIds'],
  })

export async function addDiscount(prevState: unknown, formData: FormData) {
  const bookIds = formData.getAll('bookIds')
  const result = addSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    // formData don`t provide all ids!!!
    bookIds: bookIds.length > 0 ? bookIds : undefined,
  })

  if (result.success === false) return result.error.formErrors.fieldErrors

  const data = result.data

  await db.discount.create({
    data: {
      code: data.code,
      discountAmount: data.discountAmount,
      discountType: data.discountType,
      allBooks: data.allBooks,
      books: data.bookIds != null ? { connect: data.bookIds.map((id) => ({ id })) } : undefined,
      expiresAt: data.expiresAt!,
      limit: data.limit,
    },
  })

  redirect('/admin/discounts')
}

export async function toggleDiscountActive(id: string, isActive: boolean) {
  await db.discount.update({ where: { id }, data: { isActive } })
}

export async function deleteDiscount(id: string) {
  const discount = await db.discount.delete({ where: { id } })

  if (discount == null) return notFound()

  return discount
}
