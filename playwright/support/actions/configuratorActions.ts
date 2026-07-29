import { Page, expect } from '@playwright/test'

export type ExteriorColorLabel = 'Glacier Blue' | 'Midnight Black' | 'Lunar White'
export type WheelLabel = 'Aero Wheels' | 'Sport Wheels'
export type OptionalLabel = 'Precision Park' | 'Flux Capacitor'

export function createConfiguratorActions(page: Page) {
  return {
    async open() {
      await page.goto('/configure')
      await page.evaluate(() => localStorage.removeItem('velo-configurator-storage'))
      await page.reload()
    },

    async selectColor(color: ExteriorColorLabel) {
      await page.getByRole('button', { name: color }).click()
    },

    async selectWheels(wheels: WheelLabel) {
      await page.getByRole('button', { name: new RegExp(wheels) }).click()
    },

    async toggleOptional(optional: OptionalLabel) {
      await page.getByRole('checkbox', { name: new RegExp(optional) }).click()
    },

    async goToCheckout() {
      await page.getByRole('button', { name: 'Monte o Seu' }).click()
    },

    async validatePrice(price: string) {
      const totalPrice = page.getByTestId('total-price')
      await expect(totalPrice).toBeVisible()
      await expect(totalPrice).toHaveText(price)
    },

    async validateCarImage(src: string) {
      const carImage = page.locator('img[alt^="Velô Sprint"]')
      await expect(carImage).toHaveAttribute('src', src)
    },

    async validateCheckoutSummary(price: string, optionals: OptionalLabel[] = []) {
      await expect(page).toHaveURL(/\/order/)
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
      await expect(page.getByTestId('summary-total-price')).toHaveText(price)

      for (const optional of optionals) {
        await expect(page.getByText(optional, { exact: true })).toBeVisible()
      }
    },
  }
}
