import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

test.describe('Consulta de Pedido', ()=> {

  test.beforeEach(async ({page}) => {
     //Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
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

  //Act
  await page.getByTestId('search-order-id').fill(order.number);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert
  // await expect(page.getByText(order)).toBeVisible({ timeout: 10_000 });
  // await page.getByText(order).click();

  // await expect(page.getByText('APROVADO')).toBeVisible();
  // await page.getByText('APROVADO').click();  


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

    const statusBadge = page.getByRole('status').filter({ hasText: 'APROVADO' });
    await expect(statusBadge).toBeVisible();
    await expect(statusBadge).toHaveText('APROVADO');
    await expect(statusBadge).toHaveClass(/bg-green-100/);
    await expect(statusBadge).toHaveClass(/text-green-700/);

    const statusIcon = statusBadge.locator('svg');
    await expect(statusIcon).toHaveClass(/lucide-circle-check-big/);
;

});

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

  //Act
  await page.getByTestId('search-order-id').fill(order.number);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert
  // await expect(page.getByText(order)).toBeVisible({ timeout: 10_000 });
  // await page.getByText(order).click();

  // await expect(page.getByText('APROVADO')).toBeVisible();
  // await page.getByText('APROVADO').click();  


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

    const statusBadge = page.getByRole('status').filter({ hasText: 'REPROVADO' });
    await expect(statusBadge).toBeVisible();
    await expect(statusBadge).toHaveText('REPROVADO');
    await expect(statusBadge).toHaveClass(/bg-red-100/);
    await expect(statusBadge).toHaveClass(/text-red-700/);

    const statusIcon = statusBadge.locator('svg');
    await expect(statusIcon).toHaveClass(/lucide-circle-x/);

});

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

  //Act
  await page.getByTestId('search-order-id').fill(order.number);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert
  // await expect(page.getByText(order)).toBeVisible({ timeout: 10_000 });
  // await page.getByText(order).click();

  // await expect(page.getByText('APROVADO')).toBeVisible();
  // await page.getByText('APROVADO').click();  


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

    const statusBadge = page.getByRole('status').filter({ hasText: 'EM_ANALISE  ' });
    await expect(statusBadge).toBeVisible();
    await expect(statusBadge).toHaveText('EM_ANALISE');
    await expect(statusBadge).toHaveClass(/bg-yellow-100/);
    await expect(statusBadge).toHaveClass(/text-yellow-700/);

    const statusIcon = statusBadge.locator('svg');
    await expect(statusIcon).toHaveClass(/lucide-clock/);
});

test('Deve exibir mensagem quando pedido não é encontrado', async ({ page }) => {

  //Test Data
  const order = generateOrderCode();

 
  await page.getByTestId('search-order-id').fill(order);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  const title = page.getByRole('heading', { name: 'Pedido não encontrado' });
  await expect(title).toBeVisible();

  // const mensage = page.locator('//p[text()="Verifique o número do pedido e tente novamente"]')
  // const mensage = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'})
  // await expect(mensage).toBeVisible();

  // await expect(page.locator('#root')).toContainText('Pedido não encontrado');
  // await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente');

  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);
})

})

