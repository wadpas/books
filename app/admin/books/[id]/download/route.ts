import { db } from '@/db/db'
import { notFound } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await db.book.findUnique({
    where: { id },
    select: { filePath: true, title: true },
  })

  if (book == null) return notFound()

  const { size } = await fs.stat(book.filePath)
  const file = await fs.readFile(book.filePath)
  const extension = book.filePath.split('.').pop()

  return new NextResponse(file, {
    headers: {
      'Content-Disposition': `attachment; filename="${book.title}.${extension}"`,
      'Content-Length': size.toString(),
    },
  })
}
