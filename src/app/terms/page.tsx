import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { ArrowLeft, FileText, Shield, AlertTriangle, Users, Globe } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MultiLink
              </span>
            </Link>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Termos de Uso
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Última atualização: 15 de janeiro de 2024
            </p>
          </div>

          <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    1. Aceitação dos Termos
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Ao acessar e usar o MultiLink, você concorda em cumprir e estar vinculado aos seguintes 
                    termos e condições de uso. Se você não concordar com qualquer parte destes termos, 
                    não deve usar nosso serviço.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-green-500" />
                    2. Descrição do Serviço
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    O MultiLink é uma plataforma online que permite aos usuários:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                    <li>Criar e gerenciar páginas de links personalizadas</li>
                    <li>Coletar e analisar dados de tráfego e interações</li>
                    <li>Usar formulários para captura de leads</li>
                    <li>Integrar com sistemas externos via webhooks</li>
                    <li>Personalizar a aparência de suas páginas</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-purple-500" />
                    3. Responsabilidades do Usuário
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Como usuário do MultiLink, você se compromete a:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                    <li>Fornecer informações verdadeiras e atualizadas durante o cadastro</li>
                    <li>Manter a confidencialidade de sua conta e senha</li>
                    <li>Não usar o serviço para atividades ilegais ou não autorizadas</li>
                    <li>Respeitar os direitos de propriedade intelectual de terceiros</li>
                    <li>Não enviar spam ou conteúdo malicioso</li>
                    <li>Cumprir todas as leis aplicáveis em sua jurisdição</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-orange-500" />
                    4. Uso Aceitável
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    É proibido usar o MultiLink para:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                    <li>Distribuir malware, vírus ou código malicioso</li>
                    <li>Fazer engenharia reversa ou tentar acessar o código fonte</li>
                    <li>Usar bots ou scripts automatizados não autorizados</li>
                    <li>Violar leis de privacidade ou proteção de dados</li>
                    <li>Promover discurso de ódio ou conteúdo ofensivo</li>
                    <li>Realizar atividades fraudulentas ou enganosas</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    5. Limitação de Responsabilidade
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    O MultiLink não será responsável por danos diretos, indiretos, incidentais, 
                    especiais ou consequenciais resultantes do uso ou incapacidade de usar nosso 
                    serviço. Nossa responsabilidade total não excederá o valor pago pelos serviços 
                    nos últimos 12 meses.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    6. Propriedade Intelectual
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Todo o conteúdo do MultiLink, incluindo mas não limitado a textos, gráficos, 
                    logotipos, ícones, imagens, compilações de dados e software, é propriedade 
                    do MultiLink ou de seus licenciadores e está protegido por leis de direitos 
                    autorais e outras leis de propriedade intelectual.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    7. Privacidade e Proteção de Dados
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    O uso de informações pessoais é regido por nossa 
                    <Link href="/privacy" className="text-blue-600 hover:underline mx-1">
                      Política de Privacidade
                    </Link>
                    , que faz parte integrante destes Termos de Uso. 
                    Estamos em conformidade com a LGPD (Lei Geral de Proteção de Dados) brasileira.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    8. Modificações dos Termos
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                    As alterações entrarão em vigor imediatamente após a publicação. 
                    O uso continuado do serviço após as modificações constitui aceitação 
                    dos novos termos.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    9. Rescisão
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Podemos suspender ou encerrar sua conta a qualquer momento por violação 
                    destes termos ou por qualquer outro motivo a nosso critério. 
                    Você também pode encerrar sua conta a qualquer momento.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    10. Lei Aplicável
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Estes termos são regidos pelas leis brasileiras. 
                    Qualquer disputa será resolvida nos tribunais competentes do Brasil.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    11. Contato
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Email:</strong> legal@multilink.com.br<br/>
                      <strong>Endereço:</strong> São Paulo, SP, Brasil<br/>
                      <strong>Website:</strong> 
                      <Link href="/contact" className="text-blue-600 hover:underline ml-1">
                        Página de Contato
                      </Link>
                    </p>
                  </div>
                </section>

              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
