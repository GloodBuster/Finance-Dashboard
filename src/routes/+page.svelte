<script lang="ts">
	import BcvConverter from '$lib/components/tools/BcvConverter.svelte';
	import * as Card from '$lib/components/ui/card';
	import { DollarSign, TrendingUp, TrendingDown, CircleAlert } from 'lucide-svelte';

	let { data } = $props();

	// Fallback visual si no hay datos
	let finanzas = $derived(
		data.financeData || {
			mesActual: '---',
			patrimonioTotal: 0,
			ingresos: 0,
			gastos: 0
		}
	);
</script>

<div class="space-y-6">
	<div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
			<p class="text-sm text-zinc-500 dark:text-zinc-400">Tu resumen financiero general.</p>
		</div>

		{#if data.error}
			<div
				class="flex max-w-md items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm md:items-center dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
			>
				<CircleAlert class="mt-0.5 h-5 w-5 shrink-0 md:mt-0" />
				<span class="leading-tight">{data.error}</span>
			</div>
		{/if}
	</div>

	<div class="grid gap-4 md:grid-cols-3">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Patrimonio Total</Card.Title>
				<DollarSign class="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold">${finanzas.patrimonioTotal.toFixed(2)}</div>
				<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Actualizado en tiempo real</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Ingresos ({finanzas.mesActual})</Card.Title>
				<TrendingUp class="h-4 w-4 text-emerald-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
					+${finanzas.ingresos.toFixed(2)}
				</div>
				<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Registrados este mes</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Gastos ({finanzas.mesActual})</Card.Title>
				<TrendingDown class="h-4 w-4 text-red-500" />
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-red-600 dark:text-red-500">
					-${finanzas.gastos.toFixed(2)}
				</div>
				<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Consumidos este mes</p>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<BcvConverter />
	</div>
</div>
