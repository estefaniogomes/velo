import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
import { Navbar } from '../support/components/Navbar'
import { LandingPage } from '../support/pages/LandingPage'
import { OrderLockupPage, OrderDetails } from '../support/pages/OrderLockupPage';


test.describe('Consulta de Pedido', () => {

  let orderLockupPage: OrderLockupPage

  test.beforeEach(async ({ page }) => {
    await new LandingPage(page).goto()
    await new Navbar(page).orderLockupLink()

    orderLockupPage = new OrderLockupPage(page)
    orderLockupPage.validatePageLoaded()
  })

  test('Deve consultar um Pedido Aprovado', async ({ page }) => {
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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('Deve consultar um Pedido Reprovado', async ({ page }) => {
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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('Deve consultar um Pedido Em Analise', async ({ page }) => {
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

    await orderLockupPage.searchOrder(order.number)

    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('Deve exibir mensagem quando pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode()

    await orderLockupPage.searchOrder(order)
    await orderLockupPage.validateOrderNotFound()
  })

  test('Deve exibir mensagem quando o formato do pedido é inválido', async ({ page }) => {
    const order = 'ABC-123'

    await orderLockupPage.searchOrder(order)
    await orderLockupPage.validateOrderNotFound()
  })
})
