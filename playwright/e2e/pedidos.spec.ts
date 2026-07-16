import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';
import { OrderLookupPage, OrderDetails } from '../support/pages/OrderLookupPage';


/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
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

    const orderLookup = new OrderLookupPage(page)

    await orderLookup.searchOrder(order.number)
    await orderLookup.validateOrderDetails(order)
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

    const orderLookup = new OrderLookupPage(page)

    await orderLookup.searchOrder(order.number)
    await orderLookup.validateOrderDetails(order)
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

    const orderLookup = new OrderLookupPage(page)

    await orderLookup.searchOrder(order.number)
    await orderLookup.validateOrderDetails(order)
  })

  test('Deve exibir mensagem quando pedido não é encontrado', async ({ page }) => {
    const order = generateOrderCode()
    const orderLookup = new OrderLookupPage(page)

    await orderLookup.searchOrder(order)
    await orderLookup.validateOrderNotFound()
  })

  test('Deve exibir mensagem quando o formato do pedido é inválido', async ({ page }) => {
    const order = 'ABC-123'
    const orderLookup = new OrderLookupPage(page)

    await orderLookup.searchOrder(order)
    await orderLookup.validateOrderNotFound()
  })
})
