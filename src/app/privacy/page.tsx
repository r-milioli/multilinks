'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Footer } from '@/shared/components/layout/Footer'
import { useContact } from '@/shared/hooks/useContact'
import { ArrowLeft, Shield, Eye, Database, Lock, User, Mail, Settings, AlertTriangle } from 'lucide-react'

export default function PrivacyPage() {
  const { contactData, isLoading } = useContact()

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
                      <strong>Email:</strong> {isLoading ? 'Carregando...' : (contactData?.contactInfo?.email || 'privacy@multilink.com.br')}<br/>
                      <strong>Endereço:</strong> {isLoading ? 'Carregando...' : (contactData?.contactInfo?.address ? (
                        <span dangerouslySetInnerHTML={{ __html: contactData.contactInfo.address.replace(/\n/g, '<br/>') }} />
                      ) : 'São Paulo, SP, Brasil')}<br/>
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
      <Footer />
    </div>
  )
}