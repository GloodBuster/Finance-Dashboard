<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ArrowDownRight, Search, Receipt } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	// Importamos tus funciones de utilidades
	import { getIconoCategoria, getEstiloCategoria } from '$lib/utils/categories';

	let { data } = $props();
	let movimientos = $derived(data.movimientos || []);
	let busqueda = $state('');

	let movimientosFiltrados = $derived(
		movimientos.filter(
			(m: any) =>
				m.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
				m.categoria.toLowerCase().includes(busqueda.toLowerCase())
		)
	);
</script>

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
			bind:value={busqueda}
		/>
	</div>

	<Card.Root>
		<Card.Content class="p-0">
			<div class="divide-y divide-zinc-100 dark:divide-zinc-800/50">
				{#each movimientosFiltrados as mov}
					{@const Icono = getIconoCategoria(mov.categoria)}

					<div
						class="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
					>
						<div class="flex min-w-0 flex-1 items-center gap-4">
							<div
								class={`flex aspect-square h-10 w-10 min-w-[40px] shrink-0 items-center justify-center rounded-full ${getEstiloCategoria(mov.categoria)}`}
							>
								<Icono class="h-5 w-5 shrink-0" />
							</div>

							<div class="min-w-0 flex-1 pr-2">
								<p
									class="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100"
									title={mov.descripcion}
								>
									{mov.descripcion}
								</p>
								<div class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
									<span class="shrink-0">{mov.fecha}</span>
									<span class="h-1 w-1 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>

									<span class="truncate" title={mov.categoria}>
										{mov.categoria}
									</span>
								</div>
							</div>
						</div>

						<div class="ml-2 flex shrink-0 items-center gap-2">
							<span class="font-mono text-sm font-bold text-zinc-900 dark:text-white">
								-${mov.monto.toFixed(2)}
							</span>
							<ArrowDownRight class="h-4 w-4 text-red-500" />
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<Receipt class="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
						<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
							{#if busqueda}
								No se encontraron movimientos
							{:else}
								Aún no tienes movimientos registrados
							{/if}
						</p>
						<p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
							{#if busqueda}
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
