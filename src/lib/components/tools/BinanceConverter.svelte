<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCcw, Delete, Copy, Check } from 'lucide-svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { fetchBinanceRate } from '$lib/services/api';

	const binanceQuery = createQuery(() => ({
		queryKey: ['binanceRate'],
		queryFn: fetchBinanceRate,
		staleTime: 1000 * 60 * 5
	}));

	let usdtAmount = $state('');
	let vesAmount = $state('');
	let activeField = $state<'usdt' | 'ves'>('usdt');
	let copiedUsdt = $state(false);
	let copiedVes = $state(false);

	function handleKeyPress(key: string) {
		if (binanceQuery.isFetching || binanceQuery.isError) return;

		if (key === 'backspace') {
			if (activeField === 'usdt') {
				usdtAmount = usdtAmount.slice(0, -1);
				calculateFrom('usdt');
			} else {
				vesAmount = vesAmount.slice(0, -1);
				calculateFrom('ves');
			}
			return;
		}
		if (key === '.') {
			if (activeField === 'usdt' && !usdtAmount.includes('.'))
				usdtAmount += usdtAmount === '' ? '0.' : '.';
			if (activeField === 'ves' && !vesAmount.includes('.'))
				vesAmount += vesAmount === '' ? '0.' : '.';
			return;
		}
		if (activeField === 'usdt') {
			if (usdtAmount === '0') usdtAmount = key;
			else usdtAmount += key;
			calculateFrom('usdt');
		} else {
			if (vesAmount === '0') vesAmount = key;
			else vesAmount += key;
			calculateFrom('ves');
		}
	}

	function calculateFrom(source: 'usdt' | 'ves') {
		const rate = binanceQuery.data;
		if (!rate) return;

		if (source === 'usdt') {
			if (!usdtAmount || isNaN(Number(usdtAmount))) {
				vesAmount = '';
				return;
			}
			vesAmount = (Number(usdtAmount) * rate).toFixed(2);
		} else {
			if (!vesAmount || isNaN(Number(vesAmount))) {
				usdtAmount = '';
				return;
			}
			usdtAmount = (Number(vesAmount) / rate).toFixed(2);
		}
	}

	function copyToClipboard(text: string, type: 'usdt' | 'ves') {
		navigator.clipboard.writeText(text || '0.00');
		if (type === 'usdt') {
			copiedUsdt = true;
			setTimeout(() => (copiedUsdt = false), 2000);
		} else {
			copiedVes = true;
			setTimeout(() => (copiedVes = false), 2000);
		}
	}
</script>

<Card.Root class="border-0 px-2 shadow-none sm:border sm:shadow-sm">
	<Card.Header class="flex flex-row items-center justify-between px-2 sm:px-6">
		<div>
			<Card.Title class="text-sm font-medium">Tasa Binance P2P</Card.Title>
			<p class="mt-1 text-xs text-zinc-500">BDV / Pago Móvil (Min: 8000 Bs)</p>
		</div>
		<Button
			variant="ghost"
			size="icon"
			class="h-8 w-8"
			onclick={() => binanceQuery.refetch()}
			disabled={binanceQuery.isFetching}
		>
			<RefreshCcw class="h-4 w-4 text-zinc-500 {binanceQuery.isFetching ? 'animate-spin' : ''}" />
		</Button>
	</Card.Header>

	<Card.Content class="px-2 sm:px-6">
		<div class="mb-6 flex min-h-10 items-baseline justify-center gap-2">
			{#if binanceQuery.isFetching}
				<Skeleton class="h-10 w-48" />
			{:else if binanceQuery.isError}
				<span class="text-sm font-medium text-red-500">Servicio Binance no disponible</span>
			{:else}
				<span class="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
					Bs. {binanceQuery.data?.toFixed(2)}
				</span>
				<span class="text-sm font-medium text-zinc-500 dark:text-zinc-400">/ USDT</span>
			{/if}
		</div>

		<div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
			<div class="relative w-full">
				<button
					type="button"
					class="flex w-full flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all {activeField ===
					'usdt'
						? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500 dark:border-yellow-500/50 dark:bg-yellow-900/20'
						: 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}"
					onclick={() => (activeField = 'usdt')}
				>
					<span class="text-xs font-bold tracking-wider text-zinc-500 uppercase">USDT (Tether)</span
					>
					<span
						class="text-2xl font-medium {usdtAmount
							? 'text-zinc-900 dark:text-white'
							: 'text-zinc-300 dark:text-zinc-600'}">{usdtAmount || '0.00'}</span
					>
				</button>
				<button
					type="button"
					class="absolute top-3 right-3 rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
					onclick={(e) => {
						e.stopPropagation();
						copyToClipboard(usdtAmount, 'usdt');
					}}
					title="Copiar USDT"
				>
					{#if copiedUsdt}<Check class="h-4 w-4 text-yellow-500" />{:else}<Copy
							class="h-4 w-4"
						/>{/if}
				</button>
			</div>

			<div class="relative w-full">
				<button
					type="button"
					class="flex w-full flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all {activeField ===
					'ves'
						? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500 dark:border-yellow-500/50 dark:bg-yellow-900/20'
						: 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}"
					onclick={() => (activeField = 'ves')}
				>
					<span class="text-xs font-bold tracking-wider text-zinc-500 uppercase"
						>Bolívares (Bs)</span
					>
					<span
						class="text-2xl font-medium {vesAmount
							? 'text-zinc-900 dark:text-white'
							: 'text-zinc-300 dark:text-zinc-600'}">{vesAmount || '0.00'}</span
					>
				</button>
				<button
					type="button"
					class="absolute top-3 right-3 rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
					onclick={(e) => {
						e.stopPropagation();
						copyToClipboard(vesAmount, 'ves');
					}}
					title="Copiar bolívares"
				>
					{#if copiedVes}<Check class="h-4 w-4 text-yellow-500" />{:else}<Copy
							class="h-4 w-4"
						/>{/if}
				</button>
			</div>
		</div>

		<div class="grid grid-cols-3 gap-2">
			{#each ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'] as key}
				<Button
					variant="outline"
					class="h-14 rounded-xl border-zinc-200 bg-zinc-50 text-xl font-medium transition-transform hover:bg-zinc-100 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
					onclick={() => handleKeyPress(key)}>{key}</Button
				>
			{/each}
			<Button
				variant="outline"
				class="h-14 rounded-xl border-zinc-200 bg-zinc-50 text-red-500 transition-transform hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-red-950/30"
				onclick={() => handleKeyPress('backspace')}><Delete class="h-6 w-6" /></Button
			>
		</div>
	</Card.Content>
</Card.Root>
