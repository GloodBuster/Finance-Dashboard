<script module>
	// Memoria global que sobrevive cuando el modal se cierra y se abre
	let globalRate = 0;
	let globalError = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCcw, ArrowDownUp } from 'lucide-svelte';

	// Inicializamos con los valores globales
	let rate = $state(globalRate);
	// Si ya tenemos una tasa global, no hace falta mostrar el estado de carga
	let loading = $state(globalRate === 0 && !globalError);
	let error = $state(globalError);

	// Estados del conversor
	let usdAmount = $state('');
	let vesAmount = $state('');

	// Le agregamos el parámetro force para decidir si usamos caché o forzamos la petición
	async function fetchRate(force = false) {
		// Si ya hay tasa en la memoria global y no estamos forzando la recarga, salimos temprano
		if (globalRate > 0 && !force) {
			rate = globalRate;
			error = globalError;
			loading = false;
			return;
		}

		loading = true;
		error = false;
		try {
			const res = await fetch('/api/bcv');
			const data = await res.json();
			if (data.status === 'success') {
				rate = data.rate;
				globalRate = data.rate; // Guardamos en la memoria global
				globalError = false;
				// Si ya había algo escrito, recalcular al actualizar la tasa
				if (usdAmount) handleUsdInput({ currentTarget: { value: usdAmount } } as any);
			} else {
				error = true;
				globalError = true;
			}
		} catch (e) {
			error = true;
			globalError = true;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// Al montar, intentamos cargar sin forzar (usará caché si existe)
		fetchRate(false);
	});

	// Lógica bidireccional
	function handleUsdInput(e: Event & { currentTarget: HTMLInputElement }) {
		let val = e.currentTarget.value.replace(',', '.');
		usdAmount = val;

		if (!val || isNaN(Number(val)) || rate === 0) {
			vesAmount = '';
			return;
		}
		vesAmount = (Number(val) * rate).toFixed(2);
	}

	function handleVesInput(e: Event & { currentTarget: HTMLInputElement }) {
		let val = e.currentTarget.value.replace(',', '.');
		vesAmount = val;

		if (!val || isNaN(Number(val)) || rate === 0) {
			usdAmount = '';
			return;
		}
		usdAmount = (Number(val) / rate).toFixed(2);
	}
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between pb-2">
		<div>
			<Card.Title class="text-sm font-medium">Tasa BCV y Conversor</Card.Title>
			<p class="mt-1 text-xs text-zinc-500">Cotización Oficial</p>
		</div>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => fetchRate(true)}
			disabled={loading}
		>
			<RefreshCcw class="h-4 w-4 text-zinc-500 {loading ? 'animate-spin' : ''}" />
		</Button>
	</Card.Header>
	<Card.Content>
		<div class="mb-6 flex items-baseline gap-2">
			{#if loading}
				<div class="h-8 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
			{:else if error}
				<span class="text-sm text-red-500">Servicio BCV temporalmente caído</span>
			{:else}
				<span class="text-3xl font-bold text-blue-600 dark:text-blue-500">
					Bs. {rate.toFixed(2)}
				</span>
				<span class="text-sm font-medium text-zinc-500 dark:text-zinc-400">/ USD</span>
			{/if}
		</div>

		<div
			class="relative flex flex-col gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
		>
			<div class="flex flex-col gap-1.5">
				<Label for="usd" class="text-xs font-bold tracking-wider text-zinc-500 uppercase"
					>Dólares ($)</Label
				>
				<Input
					id="usd"
					type="text"
					inputmode="decimal"
					placeholder="0.00"
					value={usdAmount}
					oninput={handleUsdInput}
					disabled={loading || error}
					class="bg-white text-lg font-medium dark:bg-black"
				/>
			</div>

			<div
				class="absolute top-1/2 left-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black"
			>
				<ArrowDownUp class="h-4 w-4 text-zinc-400" />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="ves" class="text-xs font-bold tracking-wider text-zinc-500 uppercase"
					>Bolívares (Bs)</Label
				>
				<Input
					id="ves"
					type="text"
					inputmode="decimal"
					placeholder="0.00"
					value={vesAmount}
					oninput={handleVesInput}
					disabled={loading || error}
					class="bg-white text-lg font-medium dark:bg-black"
				/>
			</div>
		</div>
	</Card.Content>
</Card.Root>
