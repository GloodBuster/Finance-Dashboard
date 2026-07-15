import { env } from '$env/dynamic/public';

// Lógica separada para el Dashboard
export async function fetchDashboardData() {
  const apiUrl = `${env.PUBLIC_GOOGLE_SCRIPT_URL}?token=${env.PUBLIC_SHEETS_TOKEN}`;
  const response = await fetch(apiUrl);
  const result = await response.json();

  if (result.status !== 'success') {
    throw new Error(result.message || "Unknown error in the script.");
  }

  return {
    currentMonth: result.data.mesActual,
    totalWealth: result.data.patrimonioTotal,
    income: result.data.ingresos,
    expenses: result.data.gastos,
    categories: result.data.categorias
  };
}

export async function fetchTransactions() {
  const apiUrl = `${env.PUBLIC_GOOGLE_SCRIPT_URL}?token=${env.PUBLIC_SHEETS_TOKEN}&action=historial`;
  const response = await fetch(apiUrl);
  const result = await response.json();

  if (result.status !== 'success') {
    throw new Error(result.message || "Error loading history.");
  }

  return result.data.map((item: any) => ({
    description: item.descripcion,
    category: item.categoria,
    date: item.fecha,
    amount: item.monto
  }));
}

export async function fetchBcvRate() {
  const res = await fetch('/api/bcv');
  const data = await res.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Error al obtener tasa BCV');
  }
  return data.rate as number;
}

export async function fetchBinanceRate() {
  const res = await fetch('/api/binance');
  const data = await res.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Error al obtener tasa Binance');
  }
  return data.rate as number;
}
