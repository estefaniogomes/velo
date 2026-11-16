import { expect, test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { deleteOrderByNumber, insertOrder } from '../support/database/orderRepository'
import type { OrderDetails } from '../support/actions/orderLockupActions'
import data from '../support/fixtures/orders.json' with { type: 'json' }

test.describe('Consulta de Pedido', () => {
  
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()
  })
  
  test('Deve consultar um Pedido Aprovado', async ({ app }) => {
    const order = data.aprovado as OrderDetails

    await deleteOrderByNumber(order.number)
    await insertOrder(order)

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)

  })

  test('Deve consultar um Pedido Reprovado', async ({ app }) => {
    const order = data.reprovado as OrderDetails

    await deleteOrderByNumber(order.number)
    await insertOrder(order)

    await app.orderLockup.searchOrder(order.number)
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.status)

  })

  test('Deve consultar um Pedido Em Analise', async ({ app }) => {
    const order = data.em_analise as OrderDetails

    await deleteOrderByNumber(order.number)
    await insertOrder(order)

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

  test('Deve manter o botão de busca desabilitado com campo vazio ou apenas espaços', async ({ app }) => {

    const button = app.orderLockup.elements.searchButton
    await expect(button).toBeDisabled()

    await app.orderLockup.elements.orderInput.fill('    ')
    await expect(button).toBeDisabled()
  })
})
