<script module>
	// Memoria global que sobrevive cuando el modal se cierra y se abre
	let globalRate = 0;
	let globalError = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCcw, Delete } from 'lucide-svelte';

	// Inicializamos con los valores globales
	let rate = $state(globalRate);
	let loading = $state(globalRate === 0 && !globalError);
	let error = $state(globalError);

	// Estados del conversor
	let usdAmount = $state('');
	let vesAmount = $state('');

	// Controla cuál de las dos "pantallas" está seleccionada para escribir
	let activeField = $state<'usd' | 'ves'>('usd');

	async function fetchRate(force = false) {
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
				globalRate = data.rate;
				globalError = false;
				if (usdAmount) calculateFrom('usd');
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
		fetchRate(false);
	});

	// Lógica del Teclado Numérico Integrado
	function handleKeyPress(key: string) {
		if (loading || error) return;

		if (key === 'backspace') {
			if (activeField === 'usd') {
				usdAmount = usdAmount.slice(0, -1);
				calculateFrom('usd');
			} else {
				vesAmount = vesAmount.slice(0, -1);
				calculateFrom('ves');
			}
			return;
		}

		if (key === '.') {
			if (activeField === 'usd' && !usdAmount.includes('.')) {
				usdAmount += usdAmount === '' ? '0.' : '.';
			}
			if (activeField === 'ves' && !vesAmount.includes('.')) {
				vesAmount += vesAmount === '' ? '0.' : '.';
			}
			return;
		}

		// Si es un número normal
		if (activeField === 'usd') {
			if (usdAmount === '0') usdAmount = key;
			else usdAmount += key;
			calculateFrom('usd');
		} else {
			if (vesAmount === '0') vesAmount = key;
			else vesAmount += key;
			calculateFrom('ves');
		}
	}

	function calculateFrom(source: 'usd' | 'ves') {
		if (rate === 0) return;

		if (source === 'usd') {
			if (!usdAmount || isNaN(Number(usdAmount))) {
				vesAmount = '';
				return;
			}
			vesAmount = (Number(usdAmount) * rate).toFixed(2);
		} else {
			if (!vesAmount || isNaN(Number(vesAmount))) {
				usdAmount = '';
				return;
			}
			usdAmount = (Number(vesAmount) / rate).toFixed(2);
		}
	}
</script>

<Card.Root class="border-0 shadow-none sm:border sm:shadow-sm px-2">
	<Card.Header class="flex flex-row items-center justify-between px-2 sm:px-6">
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
	<Card.Content class="px-2 sm:px-6">
		<div class="mb-6 flex items-baseline justify-center gap-2">
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

		<div class="mb-6 grid grid-cols-2 gap-3">
			<button
				type="button"
				class="flex w-full flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all {activeField ===
				'usd'
					? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-500/50 dark:bg-emerald-900/20'
					: 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}"
				onclick={() => (activeField = 'usd')}
			>
				<span class="text-xs font-bold tracking-wider text-zinc-500 uppercase">Dólares ($)</span>
				<span
					class="text-2xl font-medium {usdAmount
						? 'text-zinc-900 dark:text-white'
						: 'text-zinc-300 dark:text-zinc-600'}"
				>
					{usdAmount || '0.00'}
				</span>
			</button>

			<button
				type="button"
				class="flex w-full flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all {activeField ===
				'ves'
					? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-500/50 dark:bg-emerald-900/20'
					: 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}"
				onclick={() => (activeField = 'ves')}
			>
				<span class="text-xs font-bold tracking-wider text-zinc-500 uppercase">Bolívares (Bs)</span>
				<span
					class="text-2xl font-medium {vesAmount
						? 'text-zinc-900 dark:text-white'
						: 'text-zinc-300 dark:text-zinc-600'}"
				>
					{vesAmount || '0.00'}
				</span>
			</button>
		</div>

		<div class="grid grid-cols-3 gap-2">
			{#each ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'] as key}
				<Button
					variant="outline"
					class="h-14 rounded-xl border-zinc-200 bg-zinc-50 text-xl font-medium transition-transform hover:bg-zinc-100 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
					onclick={() => handleKeyPress(key)}
				>
					{key}
				</Button>
			{/each}

			<Button
				variant="outline"
				class="h-14 rounded-xl border-zinc-200 bg-zinc-50 text-red-500 transition-transform hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-red-950/30"
				onclick={() => handleKeyPress('backspace')}
			>
				<Delete class="h-6 w-6" />
			</Button>
		</div>
	</Card.Content>
</Card.Root>
