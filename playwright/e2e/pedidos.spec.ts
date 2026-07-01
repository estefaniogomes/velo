import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

import { OrderLookupPage, OrderStatus } from '../support/pages/OrderLookupPage';

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', ()=> {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })
  
  //AAA - Arrange, Act, Assert

test('Deve consultar um Pedido Aprovado', async ({ page }) => {

  //Test Data
  //const order = 'VLO-399B26'

  const order = {
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

  // Act
  const orderLookupPage = new OrderLookupPage(page)

  await orderLookupPage.searchOrder(order.number)

  //Assert
   await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheelType} Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.paymentMethod}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    await orderLookupPage.expectStatusBadge(order.status as OrderStatus)

})

test('Deve consultar um Pedido Reprovado', async ({ page }) => {

  //Test Data
  //const order = 'VLO-FQE5NL'

  const order = {
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

  // Act
 const orderLookupPage = new OrderLookupPage(page)

 await orderLookupPage.searchOrder(order.number)

  //Assert
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheelType} Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.paymentMethod}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    await orderLookupPage.expectStatusBadge(order.status as OrderStatus)
})

test('Deve consultar um Pedido Em Analise', async ({ page }) => {

  //Test Data
  //const order = 'VLO-FQE5NL'

  const order = {
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


 // Act
 const orderLookupPage = new OrderLookupPage(page)

 await orderLookupPage.searchOrder(order.number)

  //Assert
  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheelType} Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.paymentMethod}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    await orderLookupPage.expectStatusBadge(order.status as OrderStatus)
})

test('Deve exibir mensagem quando pedido não é encontrado', async ({ page }) => {

  //Test Data
  const order = generateOrderCode()

 // Act
  const orderLookupPage = new OrderLookupPage(page)

  await orderLookupPage.searchOrder(order)


  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)

  })
})