<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
	import ChartDataLabels from 'chartjs-plugin-datalabels';

	// IMPORTAMOS NUESTRA MAGIA DE COLORES
	import { getHexCategoria } from '$lib/utils/categories';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

	type Categoria = {
		nombre: string;
		presupuesto: number;
		gastado: number;
		restante: number;
	};

	let { categorias = [] }: { categorias: Categoria[] } = $props();

	let categoriasActivas = $derived(categorias.filter((cat) => cat.gastado > 0));

	let chartData = $derived({
		labels: categoriasActivas.map((cat) => cat.nombre),
		datasets: [
			{
				data: categoriasActivas.map((cat) => cat.gastado),
				// AQUÍ ESTÁ LA MAGIA: Le pedimos el color hexadecimal exacto para cada categoría
				backgroundColor: categoriasActivas.map((cat) => getHexCategoria(cat.nombre)),
				borderWidth: 0,
				hoverOffset: 4
			}
		]
	});

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: '65%',
		plugins: {
			legend: {
				position: 'bottom' as const,
				labels: {
					color: '#a1a1aa',
					usePointStyle: true,
					padding: 20
				}
			},
			datalabels: {
				color: '#ffffff',
				font: {
					weight: 'bold' as const,
					size: 11
				},
				formatter: (value: number, context: any) => {
					const dataset = context.chart.data.datasets[0].data;
					const total = dataset.reduce((acc: number, val: number) => acc + val, 0);
					const porcentaje = Math.round((value / total) * 100);
					return porcentaje > 5 ? `${porcentaje}%` : null;
				}
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						return ` $${context.parsed.toFixed(2)}`;
					}
				}
			}
		}
	};
</script>

<Card.Root class="flex h-full flex-col">
	<Card.Header>
		<Card.Title>Distribución de Gastos</Card.Title>
		<Card.Description>¿A dónde se ha ido tu dinero?</Card.Description>
	</Card.Header>
	<Card.Content class="flex min-h-[250px] flex-1 items-center justify-center">
		{#if categoriasActivas.length > 0}
			<div class="relative h-full w-full">
				<Doughnut data={chartData} options={chartOptions} />
			</div>
		{:else}
			<p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
				Aún no hay gastos registrados este mes.
			</p>
		{/if}
	</Card.Content>
</Card.Root>
