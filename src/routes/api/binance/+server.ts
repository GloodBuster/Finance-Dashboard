import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    const response = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fiat: 'VES',
        page: 1,
        rows: 5,
        tradeType: 'SELL',
        asset: 'USDT',
        countries: [],
        proMerchantAds: false,
        shieldMerchantAds: false,
        publisherType: 'merchant', // <-- ESTE ES EL CAMBIO (Solo comerciantes verificados)
        payTypes: ['BancoDeVenezuela', 'PagoMovil'],
        classifies: ['mass', 'profession', 'user'],
        transAmount: '8000'
      })
    });

    const data = await response.json();

    if (data.code === '000000' && data.data && data.data.length > 0) {
      const bestPrice = parseFloat(data.data[0].adv.price);
      return json({ status: 'success', rate: bestPrice });
    } else {
      return json({ status: 'error', message: 'No ads found' }, { status: 404 });
    }
  } catch (error: any) {
    return json({ status: 'error', message: error.message }, { status: 500 });
  }
}