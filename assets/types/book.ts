export type Book = {
  _id: {
    $oid: string
  }
  title: string
  slug: string
  author: string
  description: string
  genre: string[]
  year: number
  cover: string
  price: number
  maxQuantity: number
}
