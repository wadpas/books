import { Book } from './book'

export type OrderStatus = 'Pending' | 'Completed' | 'Shipped' | 'InTransit'

export type Order = {
  id: string
  slug: string
  item: string
  details: string
  status: OrderStatus
  date: string
  items: string[]
}
