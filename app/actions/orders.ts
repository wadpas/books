'use server'

import { db } from '@/db/db'

export async function userOrderExists(email: string, bookId: string) {
  return (
    (await db.order.findFirst({
      where: { user: { email }, bookId },
      select: { id: true },
    })) != null
  )
}
