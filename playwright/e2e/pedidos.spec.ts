import { test, expect } from '@playwright/test';

test('Consulta de Pedido', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  //Checkpoint 1: Verificar se a página de landing está online
  await page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' }).click();

  //Checkpoint 2: Verificar se o botão de consultar pedido está visível
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  //Checkpoint 3: Verificar se o formulário de consulta de pedido está visível
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  await page.getByTestId('search-order-id').fill('VLO-399B26');

  await page.getByTestId('search-order-button').click();
  await expect(page.getByTestId('order-result-id')).toBeVisible();
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-399B26');
  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');

});