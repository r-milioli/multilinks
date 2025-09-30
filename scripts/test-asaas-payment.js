require('dotenv').config({ path: '.env.local' });

async function testAsaasPayment() {
  console.log('🔍 Testando criação de cobrança na Asaas...');
  
  const API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
  const API_KEY = process.env.ASAAS_API_KEY;
  
  console.log('API_URL:', API_URL);
  console.log('API_KEY configurada:', !!API_KEY);
  console.log('API_KEY (primeiros 10 chars):', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NÃO CONFIGURADA');
  
  if (!API_KEY) {
    console.error('❌ ASAAS_API_KEY não configurada');
    return;
  }
  
  try {
    // 1. Criar cliente
    console.log('\n📝 1. Criando cliente...');
    const customerData = {
      name: 'Teste Cliente',
      email: 'teste@exemplo.com',
      cpfCnpj: '12345678901',
      phone: '11999999999'
    };
    
    const customerResponse = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': API_KEY
      },
      body: JSON.stringify(customerData)
    });
    
    if (!customerResponse.ok) {
      const error = await customerResponse.json();
      console.error('❌ Erro ao criar cliente:', error);
      return;
    }
    
    const customer = await customerResponse.json();
    console.log('✅ Cliente criado:', customer.id);
    
    // 2. Criar cobrança PIX
    console.log('\n💰 2. Criando cobrança PIX...');
    const chargeData = {
      customer: customer.id,
      billingType: 'PIX',
      value: 25.00,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: 'Teste PIX - MultiLink',
      externalReference: `test_${Date.now()}`
    };
    
    console.log('Dados da cobrança:', JSON.stringify(chargeData, null, 2));
    
    const chargeResponse = await fetch(`${API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': API_KEY
      },
      body: JSON.stringify(chargeData)
    });
    
    if (!chargeResponse.ok) {
      const error = await chargeResponse.json();
      console.error('❌ Erro ao criar cobrança:', error);
      return;
    }
    
    const charge = await chargeResponse.json();
    console.log('✅ Cobrança criada:', charge.id);
    console.log('📋 Resposta completa da Asaas:');
    console.log(JSON.stringify(charge, null, 2));
    
    // 3. Verificar campos específicos
    console.log('\n🔍 3. Verificando campos específicos:');
    console.log('charge.pixTransaction:', charge.pixTransaction);
    console.log('charge.invoiceUrl:', charge.invoiceUrl);
    console.log('charge.bankSlipUrl:', charge.bankSlipUrl);
    console.log('charge.status:', charge.status);
    
    if (charge.pixTransaction) {
      console.log('✅ PIX disponível:');
      console.log('  QR Code:', charge.pixTransaction.qrCode);
      console.log('  QR Code Image:', charge.pixTransaction.qrCodeImage);
    } else {
      console.log('❌ PIX não disponível na resposta');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testAsaasPayment();
