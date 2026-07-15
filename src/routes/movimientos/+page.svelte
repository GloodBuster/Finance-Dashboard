<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import * as Card from '$lib/components/ui/card';
	import { ArrowDownRight, Search, Receipt } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { getIconoCategoria, getEstiloCategoria } from '$lib/utils/categories';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { fetchTransactions } from '$lib/services/api';

	let searchQuery = $state('');

	const transactionsQuery = createQuery(() => ({
		queryKey: ['transactions'],
		queryFn: fetchTransactions
	}));

	let filteredTransactions = $derived(
		(transactionsQuery.data || []).filter(
			(tx: any) =>
				tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tx.category.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

{#if transactionsQuery.isLoading}
	<div class="space-y-6">
		<div>
			<Skeleton class="h-8 w-48" />
			<Skeleton class="mt-2 h-4 w-64" />
		</div>

		<div class="relative max-w-md">
			<Skeleton class="h-10 w-full" />
		</div>

		<Card.Root>
			<Card.Content class="p-0">
				<div class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
					{#each Array(6) as _}
						<div class="flex items-center justify-between p-4">
							<div class="flex items-center gap-4">
								<Skeleton class="h-10 w-10 rounded-full" />
								<div>
									<Skeleton class="h-4 w-32" />
									<Skeleton class="mt-2 h-3 w-24" />
								</div>
							</div>
							<Skeleton class="h-5 w-16" />
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{:else if transactionsQuery.isError}
	<div class="space-y-6">
		<div
			class="flex max-w-md items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm md:items-center dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
		>
			<Receipt class="mt-0.5 h-5 w-5 shrink-0 md:mt-0" />
			<span class="leading-tight">{transactionsQuery.error?.message}</span>
		</div>
	</div>
{:else if transactionsQuery.isSuccess}
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Movimientos</h1>
			<p class="text-sm text-zinc-500 dark:text-zinc-400">
				Historial detallado de tus transacciones.
			</p>
		</div>

		<div class="relative max-w-md">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
			<Input
				type="text"
				placeholder="Buscar por descripción o categoría..."
				class="bg-white pl-10 dark:bg-zinc-900"
				bind:value={searchQuery}
			/>
		</div>

		<Card.Root>
			<Card.Content class="p-0">
				<div class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
					{#each filteredTransactions as tx}
						{@const Icono = getIconoCategoria(tx.category)}

						<div
							class="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
						>
							<div class="flex min-w-0 flex-1 items-center gap-4">
								<div
									class={`flex aspect-square h-10 w-10 min-w-10 shrink-0 items-center justify-center rounded-full ${getEstiloCategoria(tx.category)}`}
								>
									<Icono class="h-5 w-5 shrink-0" />
								</div>

								<div class="min-w-0 flex-1 pr-2">
									<p
										class="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100"
										title={tx.description}
									>
										{tx.description}
									</p>
									<div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
										<span class="shrink-0">{tx.date}</span>
										<span class="h-1 w-1 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
										<span class="truncate" title={tx.category}>{tx.category}</span>
									</div>
								</div>
							</div>

							<div class="ml-2 flex shrink-0 items-center gap-2">
								<span class="font-mono text-sm font-bold text-zinc-900 dark:text-white">
									-${tx.amount.toFixed(2)}
								</span>
								<ArrowDownRight class="h-4 w-4 text-red-500" />
							</div>
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center py-12 text-center">
							<Receipt class="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
							<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
								{#if searchQuery}
									No se encontraron movimientos
								{:else}
									Aún no tienes movimientos registrados
								{/if}
							</p>
							<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
								{#if searchQuery}
									Intenta con otros términos de búsqueda.
								{:else}
									Tus gastos aparecerán aquí cuando los agregues en tu Google Sheet.
								{/if}
							</p>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
