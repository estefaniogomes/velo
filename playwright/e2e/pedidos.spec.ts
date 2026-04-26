import { test, expect } from '@playwright/test';

//AAA - Arrange, Act, Assert


test('Consulta de Pedido', async ({ page }) => {
  //Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  //Act
  await page.getByTestId('search-order-id').fill('VLO-399B26');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  //Assert
  await expect(page.getByText('VLO-399B26')).toBeVisible({timeout : 10_000});
  await page.getByText('VLO-399B26').click();

  await expect(page.getByText('APROVADO')).toBeVisible();
  await page.getByText('APROVADO').click();

});