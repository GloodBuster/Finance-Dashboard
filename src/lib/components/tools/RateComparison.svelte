<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { ArrowUpRight, ArrowDownRight, TrendingUp, Percent } from 'lucide-svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';

	// Importaciones de Chart.js
	import { Bar } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale
	} from 'chart.js';

	// Registrar los elementos de Chart.js
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	let bcvRate = $state(0);
	let binanceRate = $state(0);
	let isLoading = $state(true);
	let error = $state(false);

	onMount(async () => {
		try {
			const [bcvRes, binanceRes] = await Promise.all([fetch('/api/bcv'), fetch('/api/binance')]);

			const bcvData = await bcvRes.json();
			const binanceData = await binanceRes.json();

			if (bcvData.status === 'success' && binanceData.status === 'success') {
				bcvRate = bcvData.rate;
				binanceRate = binanceData.rate;
			} else {
				error = true;
			}
		} catch (e) {
			error = true;
		} finally {
			isLoading = false;
		}
	});

	// Cálculos de la brecha
	let difference = $derived(Math.abs(binanceRate - bcvRate));
	let percentDiff = $derived(bcvRate > 0 ? (difference / bcvRate) * 100 : 0);
	let isBinanceHigher = $derived(binanceRate > bcvRate);

	// Configuración reactiva de los datos para la gráfica
	let chartData = $derived({
		labels: ['BCV Oficial', 'Binance P2P'],
		datasets: [
			{
				label: 'Tasa de Cambio',
				data: [bcvRate, binanceRate],
				backgroundColor: [
					'rgba(59, 130, 246, 0.8)', // Color Azul para BCV (Tailwind blue-500)
					'rgba(234, 179, 8, 0.8)' // Color Amarillo para Binance (Tailwind yellow-500)
				],
				borderColor: [
					'rgb(37, 99, 235)', // blue-600
					'rgb(202, 138, 4)' // yellow-600
				],
				borderWidth: 1,
				borderRadius: 6, // Bordes redondeados modernos
				barThickness: 32 // Grosor de las barras
			}
		]
	});

	// Opciones estéticas de la gráfica
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: 'y' as const,
		plugins: {
			legend: {
				display: false
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						return ` Bs. ${context.raw.toFixed(2)}`;
					}
				}
			}
		},
		scales: {
			x: {
				grid: {
					color: 'rgba(161, 161, 170, 0.1)'
				},
				ticks: {
					font: { family: "'Inter', sans-serif" }
				}
			},
			y: {
				grid: {
					display: false
				},
				ticks: {
					// Agregamos "as const" aquí:
					font: { family: "'Inter', sans-serif", weight: 'bold' as const }
				}
			}
		}
	};
</script>

<Card.Root class="overflow-hidden border-0 shadow-none sm:border sm:shadow-sm">
	<Card.Header class="bg-zinc-50/50 pb-4 dark:bg-zinc-900/20">
		<Card.Title class="flex items-center gap-2 text-lg">
			<TrendingUp class="h-5 w-5 text-blue-500" />
			Análisis de Mercado
		</Card.Title>
		<Card.Description>Comparativa entre tasa oficial y mercado P2P</Card.Description>
	</Card.Header>
	<Card.Content class="p-6">
		{#if isLoading}
			<div class="space-y-6">
				<Skeleton class="h-40 w-full rounded-xl" />
				<Skeleton class="h-20 w-full rounded-xl" />
			</div>
		{:else if error}
			<div class="flex h-32 items-center justify-center text-sm font-medium text-red-500">
				No se pudieron cargar las tasas para la comparativa.
			</div>
		{:else}
			<div class="space-y-6">
				<div class="relative h-48 w-full">
					<Bar data={chartData} options={chartOptions} />
				</div>

				<div
					class="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
				>
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
					>
						<Percent class="h-5 w-5 text-zinc-500" />
					</div>
					<div>
						<p
							class="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
						>
							Brecha Cambiaria
						</p>
						<div class="flex items-baseline gap-2">
							<span class="text-2xl font-bold text-zinc-900 dark:text-white">
								{percentDiff.toFixed(2)}%
							</span>
							{#if isBinanceHigher}
								<span class="flex items-center text-xs font-medium text-red-500">
									<ArrowUpRight class="mr-0.5 h-3 w-3" />
									Binance es mayor
								</span>
							{:else}
								<span class="flex items-center text-xs font-medium text-emerald-500">
									<ArrowDownRight class="mr-0.5 h-3 w-3" />
									Binance es menor
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
