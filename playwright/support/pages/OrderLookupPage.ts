import { Page, Locator, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

// Cores seguem o padrão do design system: bg-{color}-100 / text-{color}-700.
// Por isso só precisamos guardar a cor-base e o ícone; as classes são derivadas.
type StatusColor = 'green' | 'red' | 'yellow'

const STATUS_CONFIG: Record<OrderStatus, { color: StatusColor; icon: string }> = {
  APROVADO: { color: 'green', icon: 'lucide-circle-check-big' },
  REPROVADO: { color: 'red', icon: 'lucide-circle-x' },
  EM_ANALISE: { color: 'yellow', icon: 'lucide-clock' },
}

export class OrderLookupPage {
  constructor(private page: Page) {}

  async searchOrder(code: string) {
    await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
    await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
  }

  /**
   * Retorna o locator do badge de status, já filtrado pelo texto esperado.
   * Exposto separadamente caso o teste precise interagir com o locator puro
   * (ex: hover, screenshot) sem disparar as assertions.
   */
  getStatusBadge(status: OrderStatus): Locator {
    return this.page.getByRole('status').filter({ hasText: status })
  }

  /**
   * Valida o badge de status completo: cor de fundo, cor do texto e ícone.
   * Lança erro descritivo se o status não estiver mapeado em STATUS_CONFIG,
   * evitando falsos-positivos (assert vazio) por status desconhecido.
   */
  async expectStatusBadge(status: OrderStatus) {
    const config = STATUS_CONFIG[status]

    if (!config) {
      throw new Error(
        `[OrderLookupPage] Status "${status}" não possui estilo mapeado em STATUS_CONFIG.`
      )
    }

    const statusBadge = this.getStatusBadge(status)
    await expect(statusBadge).toHaveClass(new RegExp(`bg-${config.color}-100`))
    await expect(statusBadge).toHaveClass(new RegExp(`text-${config.color}-700`))

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(new RegExp(config.icon))
  }
}