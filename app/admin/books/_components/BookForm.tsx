'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addBook, updateBook } from '../../_actions/books'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { Book } from '@prisma/client'
import Image from 'next/image'

export default function BookForm({ book }: { book?: Book | null }) {
  const [error, action] = useActionState(book == null ? addBook : updateBook.bind(null, book.id), {})
  return (
    <form
      action={action}
      className='space-y-8'>
      <div className='space-y-2'>
        <Label htmlFor='title'>Назва</Label>
        <Input
          type='text'
          name='title'
          id='title'
          required
          defaultValue={book?.title}
        />
        {error?.title && <p className='text-destructive'>{error.title}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='author'>Автор</Label>
        <Input
          type='text'
          name='author'
          id='author'
          required
          defaultValue={book?.author}
        />
        {error?.author && <p className='text-destructive'>{error.author}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Опис</Label>
        <Textarea
          name='description'
          id='description'
          required
          defaultValue={book?.description}
        />
        {error?.description && <p className='text-destructive'>{error.description}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='year'>Рік</Label>
        <Input
          type='number'
          name='year'
          id='year'
          required
          defaultValue={book?.year}
        />
        {error?.year && <p className='text-destructive'>{error.year}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='price'>Ціна</Label>
        <Input
          type='number'
          name='price'
          id='price'
          required
          defaultValue={book?.price}
        />
        {error?.price && <p className='text-destructive'>{error.price}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='file'>Файл</Label>
        <Input
          type='file'
          name='file'
          id='file'
          required={book == null}
        />
        {book != null && <div className='text-muted-foreground'>{book.filePath}</div>}
        {error?.file && <p className='text-destructive'>{error.file}</p>}
      </div>
      <div className='space-y-2'>
        <Label htmlFor='cover'>Обкладинка</Label>
        <Input
          type='file'
          name='cover'
          id='cover'
          required={book == null}
        />
        {book != null && <div className='text-muted-foreground'>{book.coverPath}</div>}
        {book != null && (
          <Image
            src={book.coverPath}
            height='400'
            width='400'
            alt='Image'
          />
        )}
        {error?.cover && <p className='text-destructive'>{error.cover}</p>}
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
      {pending ? 'Зачекайте...' : 'Зберегти'}
    </Button>
  )
}
