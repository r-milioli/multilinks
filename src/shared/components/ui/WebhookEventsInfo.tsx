import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { Badge } from './Badge'
import { 
  FileText, 
  MousePointer, 
  Eye, 
  BarChart3, 
  Clock, 
  MapPin, 
  Smartphone,
  User,
  Calendar
} from 'lucide-react'

interface WebhookEvent {
  type: string
  name: string
  description: string
  icon: React.ComponentType<any>
  example: object
  triggers: string[]
}

const WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    type: 'lead_captured',
    name: 'Lead Capturado',
    description: 'Enviado quando um formulário é submetido com sucesso',
    icon: FileText,
    triggers: ['Submissão de formulário'],
    example: {
      type: 'lead_captured',
      timestamp: '2024-01-15T10:30:00.000Z',
      userId: 'user_123',
      userEmail: 'user@example.com',
      data: {
        leadId: 'lead_456',
        formId: 'form_789',
        formTitle: 'Formulário de Contato',
        linkId: 'link_101',
        linkTitle: 'Meu Link',
        linkUrl: 'https://example.com',
        fields: {
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '+5511999999999'
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        createdAt: '2024-01-15T10:30:00.000Z'
      }
    }
  },
  {
    type: 'link_clicked',
    name: 'Link Clicado',
    description: 'Enviado quando alguém clica em um dos seus links',
    icon: MousePointer,
    triggers: ['Clique em link na página pública'],
    example: {
      type: 'link_clicked',
      timestamp: '2024-01-15T10:25:00.000Z',
      userId: 'user_123',
      userEmail: 'user@example.com',
      data: {
        linkId: 'link_101',
        linkTitle: 'Meu Produto',
        linkUrl: 'https://meuproduto.com',
        clickCount: 42,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        country: 'BR',
        device: 'desktop-windows',
        clickedAt: '2024-01-15T10:25:00.000Z'
      }
    }
  },
  {
    type: 'page_visited',
    name: 'Página Visitada',
    description: 'Enviado quando alguém visita sua página pública',
    icon: Eye,
    triggers: ['Acesso à página pública'],
    example: {
      type: 'page_visited',
      timestamp: '2024-01-15T10:20:00.000Z',
      userId: 'user_123',
      userEmail: 'user@example.com',
      data: {
        userId: 'user_123',
        userEmail: 'user@example.com',
        pageUrl: 'https://multilink.com/username',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        country: 'BR',
        device: 'mobile-android',
        visitedAt: '2024-01-15T10:20:00.000Z'
      }
    }
  },
  {
    type: 'daily_stats',
    name: 'Estatísticas Diárias',
    description: 'Enviado diariamente com resumo das atividades',
    icon: BarChart3,
    triggers: ['API manual', 'Agendamento futuro'],
    example: {
      type: 'daily_stats',
      timestamp: '2024-01-15T23:59:00.000Z',
      userId: 'user_123',
      userEmail: 'user@example.com',
      data: {
        date: '2024-01-15',
        totalClicks: 156,
        totalLeads: 12,
        totalVisits: 89,
        topLinks: [
          { id: 'link_101', title: 'Meu Produto', clicks: 45 },
          { id: 'link_102', title: 'Contato', clicks: 32 }
        ],
        topCountries: [
          { country: 'BR', clicks: 120 },
          { country: 'US', clicks: 25 }
        ],
        deviceBreakdown: [
          { device: 'mobile-android', clicks: 89, percentage: 57 },
          { device: 'desktop-windows', clicks: 67, percentage: 43 }
        ]
      }
    }
  }
]

interface WebhookEventsInfoProps {
  className?: string
}

export function WebhookEventsInfo({ className }: WebhookEventsInfoProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Eventos de Webhook Disponíveis
        </CardTitle>
        <CardDescription>
          O sistema envia automaticamente estes eventos para seu webhook quando configurado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {WEBHOOK_EVENTS.map((event) => (
          <div key={event.type} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <event.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{event.name}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {event.type}
              </Badge>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">Quando é enviado:</h5>
              <div className="flex flex-wrap gap-1">
                {event.triggers.map((trigger, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Ver exemplo do payload
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded-md overflow-x-auto">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(event.example, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Como usar os webhooks</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Configure sua URL de webhook nas integrações</li>
            <li>• Teste a conectividade usando o botão "Testar Webhook"</li>
            <li>• Monitore os logs do seu servidor para ver os eventos</li>
            <li>• Use os dados para integrações com CRM, email marketing, etc.</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Importante</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Webhooks são enviados em background (não bloqueiam a resposta)</li>
            <li>• Timeout de 10 segundos por requisição</li>
            <li>• Sistema tenta novamente em caso de falha temporária</li>
            <li>• Headers incluem identificação do evento e usuário</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
