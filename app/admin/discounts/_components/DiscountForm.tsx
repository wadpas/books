'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import { useActionState, useState } from 'react'
import { addBook, updateBook } from '../../_actions/books'
import { useFormState, useFormStatus } from 'react-dom'
import Image from 'next/image'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DiscountType } from '@prisma/client'
import { addDiscount } from '../../_actions/discount'
import { Checkbox } from '@/components/ui/checkbox'

export function DiscountForm({ books }: { books: { title: string; id: string }[] }) {
  const [error, action] = useActionState(addDiscount, {})
  const [allBooks, setAllBooks] = useState(true)
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())

  return (
    <form
      action={action}
      className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='code'>Акція</Label>
        <Input
          type='text'
          id='code'
          name='code'
          required
        />
        {error.code && <div className='text-destructive'>{error.code}</div>}
      </div>
      <div className='space-y-2 gap-8 flex items-baseline'>
        <div className='space-y-2'>
          <Label htmlFor='discountType'>Знижка</Label>
          <RadioGroup
            id='discountType'
            name='discountType'
            defaultValue={DiscountType.PERCENTAGE}>
            <div className='flex gap-2 items-center'>
              <RadioGroupItem
                id='percentage'
                value={DiscountType.PERCENTAGE}
              />
              <Label htmlFor='percentage'>%</Label>
            </div>
            <div className='flex gap-2 items-center'>
              <RadioGroupItem
                id='fixed'
                value={DiscountType.FIXED}
              />
              <Label htmlFor='fixed'>UAH</Label>
            </div>
          </RadioGroup>
          {error.discountType && <div className='text-destructive'>{error.discountType}</div>}
        </div>
        <div className='space-y-2 flex-grow'>
          <Label htmlFor='discountAmount'>Сума знижки</Label>
          <Input
            type='number'
            id='discountAmount'
            name='discountAmount'
            required
          />
          {error.discountAmount && <div className='text-destructive'>{error.discountAmount}</div>}
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='limit'>Кількість</Label>
        <Input
          type='number'
          id='limit'
          name='limit'
        />
        <div className='text-muted-foreground'>Залишите порожнім для необмеженої кількості</div>
        {error.limit && <div className='text-destructive'>{error.limit}</div>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='expiresAt'>Дата завершення</Label>
        <Input
          type='datetime-local'
          id='expiresAt'
          name='expiresAt'
          className='w-max'
          min={today.toJSON().split(':').slice(0, -1).join(':')}
        />
        <div className='text-muted-foreground'>Залишите порожнім для безстрокової акції</div>
        {error.expiresAt && <div className='text-destructive'>{error.expiresAt}</div>}
      </div>
      <div className='space-y-2'>
        <Label>Книги</Label>
        {error.allBooks && <div className='text-destructive'>{error.allBooks}</div>}
        {error.bookIds && <div className='text-destructive'>{error.bookIds}</div>}
        <div className='flex gap-2 items-center'>
          <Checkbox
            id='allBooks'
            name='allBooks'
            checked={allBooks}
            onCheckedChange={(e) => setAllBooks(e === true)}
          />
          <Label htmlFor='allBooks'>Всі книги</Label>
        </div>
        {books.map((book) => (
          <div
            key={book.id}
            className='flex gap-2 items-center'>
            <Checkbox
              id={book.id}
              name='bookIds'
              disabled={allBooks}
              value={book.id}
            />
            <Label htmlFor={book.id}>{book.title}</Label>
          </div>
        ))}
      </div>
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}
