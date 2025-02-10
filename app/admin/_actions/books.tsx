'use server'

import { db } from '@/db/db'
import { z } from 'zod'
import fs from 'fs/promises'
import { notFound, redirect } from 'next/navigation'

const fileSchema = z.instanceof(File, { message: 'Required' })
const imageSchema = fileSchema.refine((file) => file.size === 0 || file.type.startsWith('image/'))

const addSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  year: z.coerce.number().int().min(1),
  price: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, 'Required'),
  cover: imageSchema.refine((file) => file.size > 0, 'Required'),
})

export async function addBook(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }
  const data = result.data

  await fs.mkdir('public/books', { recursive: true })
  const filePath = `public/books/${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir('public/covers', { recursive: true })
  const coverPath = `/covers/${data.cover.name}`
  await fs.writeFile(`public${coverPath}`, Buffer.from(await data.cover.arrayBuffer()))

  await db.book.create({
    data: {
      title: data.title,
      author: data.author,
      description: data.description,
      year: data.year,
      price: data.price,
      filePath,
      coverPath,
    },
  })
  redirect('/admin/books')
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  cover: fileSchema.optional(),
})

export async function updateBook(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }
  const data = result.data
  const book = await db.book.findUnique({
    where: { id },
  })

  if (book === null) return notFound()

  let filePath = book.filePath
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(book.filePath)
    filePath = `/books/${data.file.name}`
    await fs.writeFile(`public${filePath}`, Buffer.from(await data.file.arrayBuffer()))
  }

  let coverPath = book.coverPath
  if (data.cover != null && data.cover.size > 0) {
    await fs.unlink(`public${book.coverPath}`)
    coverPath = `/covers/${data.cover.name}`
    await fs.writeFile(`public${coverPath}`, Buffer.from(await data.cover.arrayBuffer()))
  }

  await db.book.update({
    where: { id },
    data: {
      title: data.title,
      author: data.author,
      description: data.description,
      year: data.year,
      price: data.price,
      filePath,
      coverPath,
    },
  })
  redirect('/admin/books')
}

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  await db.book.update({
    where: { id },
    data: { isAvailable },
  })
}

export async function deleteProduct(id: string) {
  const book = await db.book.delete({
    where: { id },
  })

  if (book === null) return notFound()

  await fs.unlink(book.filePath)
  await fs.unlink(book.coverPath)
}
