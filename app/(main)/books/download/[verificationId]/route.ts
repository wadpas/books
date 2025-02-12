import { db } from '@/db/db'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'

export async function GET(req: NextRequest, { params }: { params: Promise<{ verificationId: string }> }) {
  const { verificationId } = await params
  const data = await db.downloadVerification.findUnique({
    where: { id: verificationId, expiresAt: { gt: new Date() } },
    select: { book: { select: { filePath: true, title: true } } },
  })

  if (data == null) {
    return NextResponse.redirect(new URL('/books/download/expired', req.url))
  }

  const { size } = await fs.stat(data.book.filePath)
  const file = await fs.readFile(data.book.filePath)
  const extension = data.book.filePath.split('.').pop()

  return new NextResponse(file, {
    headers: {
      'Content-Disposition': `attachment; filename="${data.book.title}.${extension}"`,
      'Content-Length': size.toString(),
    },
  })
}
