'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Footer } from '@/shared/components/layout/Footer'
import { useContact } from '@/shared/hooks/useContact'
import { ArrowLeft, FileText, Shield, AlertTriangle, Users, Globe, LinkIcon, Sparkles } from 'lucide-react'

export default function TermsPage() {
  const { contactData, isLoading } = useContact()

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-300 to-pink-400 bg-clip-text text-transparent truncate block">
                MultiLink
              </span>
              <p className="text-xs text-gray-400 hidden sm:block">Link in Bio</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Button variant="ghost" asChild className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 sm:px-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Voltar ao início</span>
                <span className="sm:hidden">Voltar</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Termos de Uso
            </h1>
            <p className="text-xl text-gray-300">
              Última atualização: 15 de janeiro de 2024
            </p>
          </div>

          <Card className="border border-gray-700 backdrop-blur-sm bg-black">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-orange-400" />
                    1. Aceitação dos Termos
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Ao acessar e usar o MultiLink, você concorda em cumprir e estar vinculado aos seguintes 
                    termos e condições de uso. Se você não concordar com qualquer parte destes termos, 
                    não deve usar nosso serviço.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-orange-400" />
                    2. Descrição do Serviço
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    O MultiLink é uma plataforma online que permite aos usuários:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Criar e gerenciar páginas de links personalizadas</li>
                    <li>Coletar e analisar dados de tráfego e interações</li>
                    <li>Usar formulários para captura de leads</li>
                    <li>Integrar com sistemas externos via webhooks</li>
                    <li>Personalizar a aparência de suas páginas</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-orange-400" />
                    3. Responsabilidades do Usuário
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Como usuário do MultiLink, você se compromete a:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Fornecer informações verdadeiras e atualizadas durante o cadastro</li>
                    <li>Manter a confidencialidade de sua conta e senha</li>
                    <li>Não usar o serviço para atividades ilegais ou não autorizadas</li>
                    <li>Respeitar os direitos de propriedade intelectual de terceiros</li>
                    <li>Não enviar spam ou conteúdo malicioso</li>
                    <li>Cumprir todas as leis aplicáveis em sua jurisdição</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-orange-400" />
                    4. Uso Aceitável
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    É proibido usar o MultiLink para:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Distribuir malware, vírus ou código malicioso</li>
                    <li>Fazer engenharia reversa ou tentar acessar o código fonte</li>
                    <li>Usar bots ou scripts automatizados não autorizados</li>
                    <li>Violar leis de privacidade ou proteção de dados</li>
                    <li>Promover discurso de ódio ou conteúdo ofensivo</li>
                    <li>Realizar atividades fraudulentas ou enganosas</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-orange-400" />
                    5. Limitação de Responsabilidade
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    O MultiLink não será responsável por danos diretos, indiretos, incidentais, 
                    especiais ou consequenciais resultantes do uso ou incapacidade de usar nosso 
                    serviço. Nossa responsabilidade total não excederá o valor pago pelos serviços 
                    nos últimos 12 meses.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    6. Propriedade Intelectual
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Todo o conteúdo do MultiLink, incluindo mas não limitado a textos, gráficos, 
                    logotipos, ícones, imagens, compilações de dados e software, é propriedade 
                    do MultiLink ou de seus licenciadores e está protegido por leis de direitos 
                    autorais e outras leis de propriedade intelectual.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    7. Privacidade e Proteção de Dados
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    O uso de informações pessoais é regido por nossa 
                    <Link href="/privacy" className="text-orange-400 hover:text-orange-300 mx-1">
                      Política de Privacidade
                    </Link>
                    , que faz parte integrante destes Termos de Uso. 
                    Estamos em conformidade com a LGPD (Lei Geral de Proteção de Dados) brasileira.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    8. Modificações dos Termos
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                    As alterações entrarão em vigor imediatamente após a publicação. 
                    O uso continuado do serviço após as modificações constitui aceitação 
                    dos novos termos.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    9. Rescisão
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Podemos suspender ou encerrar sua conta a qualquer momento por violação 
                    destes termos ou por qualquer outro motivo a nosso critério. 
                    Você também pode encerrar sua conta a qualquer momento.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    10. Lei Aplicável
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Estes termos são regidos pelas leis brasileiras. 
                    Qualquer disputa será resolvida nos tribunais competentes do Brasil.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    11. Contato
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                  </p>
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-gray-300">
                      <strong>Email:</strong> {isLoading ? 'Carregando...' : (contactData?.contactInfo?.email || 'legal@multilink.com.br')}<br/>
                      <strong>Endereço:</strong> {isLoading ? 'Carregando...' : (contactData?.contactInfo?.address ? (
                        <span dangerouslySetInnerHTML={{ __html: contactData.contactInfo.address.replace(/\n/g, '<br/>') }} />
                      ) : 'São Paulo, SP, Brasil')}<br/>
                      <strong>Website:</strong> 
                      <Link href="/contact" className="text-orange-400 hover:text-orange-300 ml-1">
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

      {/* Footer */}
      <Footer />
    </div>
  )
}