import { test } from '../support/fixtures'

// CT02
test.describe('Configuração do Veículo ', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('Deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configurator.validatePrice('R$ 40.000,00')
    
    await app.configurator.selectColor('Midnight Black')
    await app.configurator.validatePrice('R$ 40.000,00')
    await app.configurator.validateCarImage('/src/assets/midnight-black-aero-wheels.png')
  })

  test('Deve atualizar o preço e a imagem  ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    await app.configurator.validatePrice('R$ 40.000,00')
    
    await app.configurator.selectWheels('Sport Wheels')
    await app.configurator.validatePrice('R$ 42.000,00')
    await app.configurator.validateCarImage('/src/assets/glacier-blue-sport-wheels.png')

    await app.configurator.selectWheels('Aero Wheels')
    await app.configurator.validatePrice('R$ 40.000,00')
    await app.configurator.validateCarImage('/src/assets/glacier-blue-aero-wheels.png')
  })

  // CT03
  test('Deve atualizar o preço ao marcar/desmarcar opcionais e redirecionar ao checkout', async ({ app }) => {
    await app.configurator.validatePrice('R$ 40.000,00')

    await app.configurator.toggleOptional('Precision Park')
    await app.configurator.validatePrice('R$ 45.500,00')

    await app.configurator.toggleOptional('Precision Park')
    await app.configurator.toggleOptional('Flux Capacitor')
    await app.configurator.validatePrice('R$ 45.000,00')

    await app.configurator.toggleOptional('Flux Capacitor')
    await app.configurator.validatePrice('R$ 40.000,00')

    await app.configurator.goToCheckout()
    await app.configurator.validateCheckoutSummary('R$ 40.000,00')
  })
})
