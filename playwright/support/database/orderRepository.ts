import crypto from 'crypto'
import { db } from './database'
import { OrderDetails } from '../actions/orderLockupActions'

const colorMap: Record<string, string> = {
  'Glacier Blue': 'glacier-blue',
  'Midnight Black': 'midnight-black',
  'Lunar White': 'lunar-white',
}

const paymentMap: Record<string, string> = {
  'À Vista': 'avista',
  'Financiamento': 'financiamento',
}

export async function insertOrder(order: OrderDetails) {
  await db
    .insertInto('orders')
    .values({
      id: crypto.randomUUID(),
      order_number: order.number,
      color: colorMap[order.color] ?? order.color,
      wheel_type: order.wheelType,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      customer_cpf: order.customer.document,  
      payment_method: paymentMap[order.paymentMethod] ?? order.paymentMethod,
      total_price: order.totalPrice,
      status: order.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      optionals: [],
    })
    .execute()
}

export async function deleteOrderByNumber(orderNumber: string) {
  await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
}

export async function deleteOrderByEmail(email: string) {
  await db.deleteFrom('orders').where('customer_email', '=', email).execute()
}
