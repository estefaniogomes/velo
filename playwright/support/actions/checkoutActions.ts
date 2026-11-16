import { Page, expect } from '@playwright/test'

export type CheckoutCustomerData = {
  name?: string
  surname?: string
  email?: string
  phone?: string
  cpf?: string
  store?: string
}

export type PaymentMethod = 'À Vista' | 'Financiamento'

export function createCheckoutActions(page: Page) {
  const submit = page.getByRole('button', { name: 'Confirmar Pedido' })
  const nome = page.getByTestId('checkout-name')
  const sobrenome = page.getByTestId('checkout-surname')
  const email = page.getByTestId('checkout-email')
  const telefone = page.getByTestId('checkout-phone')
  const cpf = page.getByTestId('checkout-cpf')
  const loja = page.getByTestId('checkout-store')
  const termos = page.getByTestId('checkout-terms')
  const paymentAvista = page.getByTestId('payment-avista')
  const paymentFinanciamento = page.getByTestId('payment-financiamento')
  const summaryTotalPrice = page.getByTestId('summary-total-price')
  const successStatus = page.getByTestId('success-status')
  const orderId = page.getByTestId('order-id')

  const alerts = {
    name: page.getByTestId('error-name'),
    surname: page.getByTestId('error-lastname'),
    email: page.getByTestId('error-email'),
    phone: page.getByTestId('error-phone'),
    cpf: page.getByTestId('error-document'),
    store: page.getByTestId('error-store'),
    terms: page.getByTestId('error-terms'),
  }

  return {
    elements: {
      submit,
      nome,
      sobrenome,
      email,
      telefone,
      cpf,
      loja,
      termos,
      paymentAvista,
      paymentFinanciamento,
      summaryTotalPrice,
      successStatus,
      orderId,
      alerts,
    },

    async open() {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async fillPersonalData(data: CheckoutCustomerData) {
      if (data.name !== undefined) {
        await nome.fill(data.name)
      }

      if (data.surname !== undefined) {
        await sobrenome.fill(data.surname)
      }

      if (data.email !== undefined) {
        await email.fill(data.email)
      }

      if (data.phone !== undefined) {
        await telefone.click()
        await telefone.pressSequentially(data.phone, { delay: 30 })
      }

      if (data.cpf !== undefined) {
        await cpf.click()
        await cpf.pressSequentially(data.cpf, { delay: 30 })
      }

      if (data.store !== undefined) {
        await loja.click()
        await page.getByRole('option', { name: data.store }).click()
      }
    },

    async acceptTerms() {
      await termos.click()
    },

    async selectPaymentMethod(method: PaymentMethod) {
      if (method === 'À Vista') {
        await paymentAvista.click()
      } else {
        await paymentFinanciamento.click()
      }
    },

    async submit() {
      await submit.click()
    },

    async validateOrderApproved(data: CheckoutCustomerData, totalPrice = 'R$ 40.000,00') {
      await expect(page).toHaveURL(/\/success/)
      await expect(successStatus).toHaveText('Pedido Aprovado!')
      await expect(orderId).toHaveText(/^VLO-[A-Z0-9]{6}$/)
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
      await expect(page.getByText(totalPrice)).toBeVisible()

      if (data.name && data.surname) {
        await expect(page.getByText(`${data.name} ${data.surname}`)).toBeVisible()
      }

      if (data.email) {
        await expect(page.getByText(data.email)).toBeVisible()
      }

      if (data.store) {
        await expect(page.getByText(data.store)).toBeVisible()
      }
    },
  }
}
