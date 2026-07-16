import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type OrderDetails = {
  number: string
  status: OrderStatus
  color: string
  wheelType: string
  customer: { name: string; email: string }
  paymentMethod: string
}

export class OrderLookupPage {
    private readonly statusClasses: Record<OrderStatus, [string, string, string]> = {
        APROVADO: ['bg-green-100', 'text-green-700', 'lucide-circle-check-big'],
        REPROVADO: ['bg-red-100', 'text-red-700', 'lucide-circle-x'],
        EM_ANALISE: ['bg-yellow-100', 'text-yellow-700', 'lucide-clock'],
    }

    constructor(private page: Page) { }

    async searchOrder(code: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
    }

    async validateStatusBadge(status: OrderStatus) {
        const [bgClass, textClass, iconClass] = this.statusClasses[status]
        const statusBadge = this.page.getByRole('status').filter({ hasText: status })

        await expect(statusBadge).toHaveClass(new RegExp(bgClass))
        await expect(statusBadge).toHaveClass(new RegExp(textClass))
        await expect(statusBadge.locator('svg')).toHaveClass(new RegExp(iconClass))
    }

    async validateOrderDetails(order: {
        number: string
        status: OrderStatus
        color: string
        wheelType: string
        customer: { name: string; email: string }
        paymentMethod: string
    }) {
        await expect(this.page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
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
    `)

        await this.validateStatusBadge(order.status)
    }

    async validateOrderNotFound() {
        await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)
    }
}
