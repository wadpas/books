import { Order } from './types/order'

export const ORDERS: Order[] = [
  {
    id: '1',
    item: 'Order 1',
    details: 'Details about order 1',
    status: 'Pending',
    slug: 'order-1',
    date: '2024-07-01',
    items: ['6742f4b6600575e686849375', '6742f4b6600575e686849374'],
  },
  {
    id: '2',
    item: 'Order 2',
    details: 'Details about order 2',
    status: 'Completed',
    slug: 'order-2',
    date: '2024-07-02',
    items: ['6742f4b6600575e686849372', '674ac0d3e2c719515e71c623'],
  },
  {
    id: '3',
    item: 'Order 3',
    details: 'Details about order 3',
    status: 'Shipped',
    slug: 'order-3',
    date: '2024-07-03',
    items: ['674e1dd333f2ab9e68a2d136', '674d7becc2bbfe615bfc79a5'],
  },
  {
    id: '4',
    item: 'Order 4',
    details: 'Details about order 4',
    status: 'InTransit',
    slug: 'order-4',
    date: '2024-07-04',
    items: ['674e21d3100f88f60ee72531', '674e239c100f88f60ee72533'],
  },
]
