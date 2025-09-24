import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { ArrowLeft, Shield, Eye, Database, Lock, User, Mail, Settings, AlertTriangle, LinkIcon, Heart } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-black/90 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
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
              Política de Privacidade
            </h1>
            <p className="text-xl text-gray-300">
              Última atualização: 15 de janeiro de 2024
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-gray-800/50 text-green-400 px-4 py-2 rounded-full text-sm border border-gray-700">
              <Shield className="h-4 w-4" />
              LGPD Compliant
            </div>
          </div>

          <Card className="border border-gray-700 backdrop-blur-sm bg-black">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Eye className="h-6 w-6 text-orange-400" />
                    1. Introdução
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Esta Política de Privacidade descreve como o MultiLink coleta, usa, armazena e protege 
                    suas informações pessoais quando você usa nosso serviço. Estamos comprometidos em proteger 
                    sua privacidade e cumprir a Lei Geral de Proteção de Dados (LGPD) brasileira.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-orange-400" />
                    2. Informações que Coletamos
                  </h2>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">
                    2.1 Informações Fornecidas por Você
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                    <li><strong>Dados de Cadastro:</strong> Nome, email, nome de usuário</li>
                    <li><strong>Perfil:</strong> Biografia, foto de perfil, links sociais</li>
                    <li><strong>Conteúdo:</strong> Links, formulários, configurações de tema</li>
                    <li><strong>Integrações:</strong> Chaves de API, URLs de webhook</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    2.2 Informações Coletadas Automaticamente
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                    <li><strong>Analytics:</strong> Cliques, visualizações, tempo de permanência</li>
                    <li><strong>Técnicas:</strong> Endereço IP, user agent, cookies</li>
                    <li><strong>Geolocalização:</strong> País, cidade (baseado no IP)</li>
                    <li><strong>Dispositivo:</strong> Tipo de dispositivo, navegador, sistema operacional</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    2.3 Informações de Terceiros
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Podemos receber informações de provedores de autenticação (Google, Facebook) 
                    quando você se conecta usando suas contas sociais.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-orange-400" />
                    3. Como Usamos suas Informações
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Utilizamos suas informações para:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Fornecer e manter nossos serviços</li>
                    <li>Personalizar sua experiência na plataforma</li>
                    <li>Enviar notificações importantes sobre sua conta</li>
                    <li>Melhorar nossos serviços e desenvolver novos recursos</li>
                    <li>Gerar relatórios e analytics para você</li>
                    <li>Detectar e prevenir fraudes e abusos</li>
                    <li>Cumprir obrigações legais</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-orange-400" />
                    4. Compartilhamento de Informações
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li><strong>Com seu consentimento:</strong> Quando você nos autoriza explicitamente</li>
                    <li><strong>Integrações configuradas:</strong> Via webhooks para serviços que você conectou</li>
                    <li><strong>Prestadores de serviços:</strong> Empresas que nos ajudam a operar nossa plataforma</li>
                    <li><strong>Obrigações legais:</strong> Quando exigido por lei ou autoridades competentes</li>
                    <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-orange-400" />
                    5. Armazenamento e Segurança
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Criptografia SSL/TLS para transmissão de dados</li>
                    <li>Criptografia de dados sensíveis em repouso</li>
                    <li>Acesso restrito baseado em funções</li>
                    <li>Monitoramento contínuo de segurança</li>
                    <li>Backup regular e seguro dos dados</li>
                    <li>Treinamento de segurança para nossa equipe</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="h-6 w-6 text-orange-400" />
                    6. Seus Direitos (LGPD)
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    De acordo com a LGPD, você tem os seguintes direitos:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li><strong>Acesso:</strong> Solicitar informações sobre seus dados pessoais</li>
                    <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
                    <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados</li>
                    <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                    <li><strong>Revogação:</strong> Retirar seu consentimento a qualquer momento</li>
                    <li><strong>Informação:</strong> Obter informações sobre o tratamento de seus dados</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    7. Cookies e Tecnologias Similares
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Utilizamos cookies e tecnologias similares para:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                    <li>Manter você logado em sua conta</li>
                    <li>Lembrar suas preferências e configurações</li>
                    <li>Analisar como você usa nossa plataforma</li>
                    <li>Melhorar a performance e funcionalidade</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    Você pode gerenciar cookies através das configurações do seu navegador.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    8. Retenção de Dados
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir 
                    as finalidades descritas nesta política, a menos que um período de retenção 
                    mais longo seja exigido por lei. Dados de analytics são mantidos por até 
                    2 anos para fins de análise e melhoria dos serviços.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    9. Transferência Internacional
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Seus dados podem ser transferidos e processados em países fora do Brasil. 
                    Quando isso ocorrer, garantimos que as transferências sejam feitas com 
                    proteções adequadas, incluindo cláusulas contratuais padrão aprovadas 
                    pela ANPD (Autoridade Nacional de Proteção de Dados).
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    10. Menores de Idade
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Nossos serviços não são direcionados a menores de 18 anos. Não coletamos 
                    intencionalmente informações pessoais de menores. Se descobrirmos que 
                    coletamos dados de um menor, tomaremos medidas para excluir essas informações.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-orange-400" />
                    11. Alterações nesta Política
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Podemos atualizar esta Política de Privacidade periodicamente. 
                    Notificaremos você sobre mudanças significativas por email ou através 
                    de um aviso em nossa plataforma. Recomendamos que revise esta política 
                    regularmente.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-orange-400" />
                    12. Contato
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer 
                    seus direitos, entre em contato conosco:
                  </p>
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p className="text-gray-300">
                      <strong>Encarregado de Dados (DPO):</strong><br/>
                      <strong>Email:</strong> privacy@multilink.com.br<br/>
                      <strong>Endereço:</strong> São Paulo, SP, Brasil<br/>
                      <strong>Website:</strong> 
                      <Link href="/contact" className="text-orange-400 hover:text-orange-300 ml-1">
                        Página de Contato
                      </Link>
                    </p>
                  </div>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    Você também pode entrar em contato com a ANPD para questões relacionadas 
                    à proteção de dados pessoais.
                  </p>
                </section>

              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 bg-black border-t border-gray-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">MultiLink</span>
                  <p className="text-xs text-gray-400">Link in Bio</p>
                </div>
              </div>
              <p className="text-gray-400">
                A plataforma mais completa para gerenciar seus links e crescer online.
              </p>
              <div className="flex space-x-4">
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <svg className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-white">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Preços</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contato</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} MultiLink. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 mt-4 md:mt-0">
              Feito com <Heart className="inline h-4 w-4 text-red-500" /> Por Robson Milioli
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}