import { test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLockupActions'

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()
  })

  test('Deve consultar um Pedido Aprovado', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-399B26',
      status: 'APROVADO',
      color: 'Glacier Blue',
      wheelType: 'aero',
      customer: {
        name: 'Estefânio Gomes',
        email: 'teste@teste.com.br',
      },
      paymentMethod: 'À Vista',
    }

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('Deve consultar um Pedido Reprovado', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-FQE5NL',
      status: 'REPROVADO',
      color: 'Midnight Black',
      wheelType: 'sport',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com',
      },
      paymentMethod: 'À Vista',
    }

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('Deve consultar um Pedido Em Analise', async ({ app }) => {
    const order: OrderDetails = {
      number: 'VLO-MS0UNZ',
      status: 'EM_ANALISE',
      color: 'Lunar White',
      wheelType: 'aero',
      customer: {
        name: 'João Da Silva',
        email: 'joao.teste@gmail.com',
      },
      paymentMethod: 'À Vista',
    }

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)
  })

  test('Deve exibir mensagem quando pedido não é encontrado', async ({ app }) => {
    const order = generateOrderCode()
    await app.orderLockup.searchOrder(order)
    await app.orderLockup.validateOrderNotFound()
  })

  test('Deve exibir mensagem quando o formato do pedido é inválido', async ({ app }) => {
    const order = 'ABC-123'
    await app.orderLockup.searchOrder(order)
    await app.orderLockup.validateOrderNotFound()
  })
})
