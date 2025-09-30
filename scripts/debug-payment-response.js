require('dotenv').config({ path: '.env.local' });

async function debugPaymentResponse() {
  console.log('🔍 Debugando resposta do pagamento...');
  
  const API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
  const API_KEY = process.env.ASAAS_API_KEY;
  
  console.log('API_URL:', API_URL);
  console.log('API_KEY configurada:', !!API_KEY);
  
  if (!API_KEY) {
    console.error('❌ ASAAS_API_KEY não configurada');
    return;
  }
  
  try {
    // Simular uma cobrança para ver a resposta
    console.log('\n📝 Criando cobrança de teste...');
    
    const chargeData = {
      customer: 'cus_000007063245', // ID de cliente existente
      billingType: 'PIX',
      value: 25.00,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Teste Debug - MultiLink',
      externalReference: `debug_${Date.now()}`
    };
    
    console.log('Dados da cobrança:', JSON.stringify(chargeData, null, 2));
    
    const response = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': API_KEY
      },
      body: JSON.stringify(chargeData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro ao criar cobrança:', error);
      return;
    }
    
    const charge = await response.json();
    console.log('\n✅ Cobrança criada com sucesso!');
    console.log('📋 Resposta completa da Asaas:');
    console.log(JSON.stringify(charge, null, 2));
    
    // Verificar campos específicos
    console.log('\n🔍 Verificando campos específicos:');
    console.log('charge.id:', charge.id);
    console.log('charge.invoiceUrl:', charge.invoiceUrl);
    console.log('charge.pixTransaction:', charge.pixTransaction);
    console.log('charge.bankSlipUrl:', charge.bankSlipUrl);
    console.log('charge.status:', charge.status);
    
    // Testar geração de URL
    console.log('\n🔗 Testando geração de URL:');
    const isSandbox = API_URL.includes('sandbox');
    let paymentUrl;
    
    if (charge.invoiceUrl) {
      paymentUrl = charge.invoiceUrl;
      console.log('✅ Usando invoiceUrl:', paymentUrl);
    } else if (isSandbox) {
      paymentUrl = `https://sandbox.asaas.com/i/${charge.id}`;
      console.log('✅ Usando sandbox URL:', paymentUrl);
    } else {
      paymentUrl = `https://www.asaas.com/i/${charge.id}`;
      console.log('✅ Usando production URL:', paymentUrl);
    }
    
    console.log('\n🎯 URL final de pagamento:', paymentUrl);
    
    // Simular resposta do PaymentService
    const paymentResponse = {
      id: 'test_payment_id',
      asaasId: charge.id,
      status: 'pending',
      amount: 25.00,
      currency: 'BRL',
      paymentUrl: paymentUrl
    };
    
    console.log('\n📤 Resposta final do PaymentService:');
    console.log(JSON.stringify(paymentResponse, null, 2));
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugPaymentResponse();
