'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteDiscount, toggleDiscountActive } from '../../_actions/discount'

export function ActiveToggleDropdownItem({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleDiscountActive(id, !isActive)
          router.refresh()
        })
      }}>
      {isActive ? 'Активувати' : 'Деактивувати'}
    </DropdownMenuItem>
  )
}

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteDiscount(id)
          router.refresh()
        })
      }}>
      Видалити
    </DropdownMenuItem>
  )
}
