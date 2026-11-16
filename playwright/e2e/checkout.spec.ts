import { expect, test } from '../support/fixtures'
import { deleteOrderByEmail } from '../support/database/orderRepository'

test.describe('Checkout - Validações (CT04)', () => {
  test.beforeEach(async ({ app }) => {
    await app.checkout.open()
  })

  test('deve validar obrigatoriedade de todos os campos em branco', async ({ app, page }) => {
    // Arrange
    const { alerts } = app.checkout.elements

    // Act
    await app.checkout.submit()

    // Assert
    await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(alerts.surname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    await expect(alerts.email).toHaveText('Email inválido')
    await expect(alerts.phone).toHaveText('Telefone inválido')
    await expect(alerts.cpf).toHaveText('CPF inválido')
    await expect(alerts.store).toHaveText('Selecione uma loja')
    await expect(alerts.terms).toHaveText('Aceite os termos')
    await expect(page).toHaveURL(/\/order/)
  })

  test('deve validar tamanho mínimo de Nome e Sobrenome', async ({ app, page }) => {
    // Arrange
    const { alerts } = app.checkout.elements
    await app.checkout.fillPersonalData({
      name: 'A',
      surname: 'B',
    })

    // Act
    await app.checkout.submit()

    // Assert
    await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
    await expect(alerts.surname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
    await expect(page).toHaveURL(/\/order/)
  })

  test('deve validar formato de e-mail inválido', async ({ app, page }) => {
    // Arrange
    const { alerts } = app.checkout.elements
    await app.checkout.fillPersonalData({
      name: 'Ana',
      surname: 'Silva',
      email: 'cliente@dominio',
    })

    // Act
    await app.checkout.submit()

    // Assert
    await expect(alerts.email).toHaveText('Email inválido')
    await expect(page).toHaveURL(/\/order/)
  })

  test('deve validar CPF e Telefone incompletos', async ({ app, page }) => {
    // Arrange
    const { alerts } = app.checkout.elements
    await app.checkout.fillPersonalData({
      name: 'Ana',
      surname: 'Silva',
      email: 'ana.silva@email.com',
    })

    // Act
    await app.checkout.submit()

    // Assert
    await expect(alerts.phone).toHaveText('Telefone inválido')
    await expect(alerts.cpf).toHaveText('CPF inválido')
    await expect(page).toHaveURL(/\/order/)
  })

  test('deve impedir finalização quando os termos de uso não são aceitos', async ({ app, page }) => {
    // Arrange
    const { alerts } = app.checkout.elements
    await app.checkout.fillPersonalData({
      name: 'Ana',
      surname: 'Silva',
      email: 'ana.silva@email.com',
      phone: '11987654321',
      cpf: '52998224725',
      store: 'Velô Paulista - Av. Paulista, 1000',
    })

    // Act
    await app.checkout.submit()

    // Assert
    await expect(alerts.terms).toHaveText('Aceite os termos')
    await expect(alerts.name).toHaveCount(0)
    await expect(alerts.surname).toHaveCount(0)
    await expect(alerts.email).toHaveCount(0)
    await expect(alerts.phone).toHaveCount(0)
    await expect(alerts.cpf).toHaveCount(0)
    await expect(alerts.store).toHaveCount(0)
    await expect(page).toHaveURL(/\/order/)
  })
})

test.describe('Checkout - Pagamento e Confirmação (CT05)', () => {
  test('deve criar um pedido com sucesso para pagamento à vista', async ({ app, page }) => {

    const customer = {
      name: 'Estefânio',
      surname: 'Gomes',
      email: 'ct05.avista@velo.com.br',
      phone: '11987654321',
      cpf: '52998224725',
      store: 'Velô Paulista - Av. Paulista, 1000',
      paymentMethod: 'À Vista' as const,
      totalPrice: 'R$ 40.000,00',
    }

    // Arrange
    await deleteOrderByEmail(customer.email)

    await page.goto('/')
    await page.getByRole('link', { name: /Configure Agora/i }).click()

    await app.configurator.validatePrice(customer.totalPrice)
    await app.configurator.goToCheckout()
    await app.configurator.validateCheckoutSummary(customer.totalPrice)

    const { paymentAvista, summaryTotalPrice } = app.checkout.elements
    await app.checkout.fillPersonalData(customer)
    await app.checkout.selectPaymentMethod(customer.paymentMethod)
    await expect(paymentAvista).toContainText(customer.totalPrice)
    await expect(summaryTotalPrice).toHaveText(customer.totalPrice)
    await app.checkout.acceptTerms()

    // Act
    await app.checkout.submit()

    // Assert
    await app.checkout.validateOrderApproved(customer, customer.totalPrice)
  })
})

