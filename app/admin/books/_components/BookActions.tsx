'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useTransition } from 'react'
import { deleteProduct, toggleProductAvailability } from '../../_actions/books'
import { useRouter } from 'next/navigation'

export function ActiveToggleDropdownItem({ id, isAvailable }: { id: string; isAvailable: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailable)
          router.refresh()
        })
      }}>
      {isAvailable ? 'Деактивувати' : 'Активувати'}
    </DropdownMenuItem>
  )
}

export function DeleteDropdownItem({ id, disabled }: { id: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <DropdownMenuItem
      disabled={isPending || disabled}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id)
          router.refresh()
        })
      }}>
      <p className='text-red-500'>Видалити</p>
    </DropdownMenuItem>
  )
}
