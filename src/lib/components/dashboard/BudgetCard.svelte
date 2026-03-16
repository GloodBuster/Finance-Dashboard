<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	type Categoria = {
		nombre: string;
		presupuesto: number;
		gastado: number;
		restante: number;
	};

	let { categorias = [], mesActual = '' }: { categorias: Categoria[]; mesActual: string } =
		$props();
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Presupuesto vs. Gastado</Card.Title>
		<Card.Description>Desglose de tus límites para {mesActual}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="scrollbar-elegant max-h-56 space-y-5 overflow-y-auto pr-3">
			{#each categorias as cat}
				{@const porcentajeBruto = cat.presupuesto > 0 ? (cat.gastado / cat.presupuesto) * 100 : 0}
				{@const porcentaje = Math.min(porcentajeBruto, 100)}
				{@const peligro = porcentajeBruto > 100}
				{@const advertencia = porcentajeBruto >= 80 && !peligro}

				<div class="space-y-1.5">
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2">
							<span class="font-medium text-zinc-700 dark:text-zinc-200">{cat.nombre}</span>

							<span
								class="rounded-md px-1.5 py-0.5 text-[10px] font-bold
                                {peligro
									? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
									: advertencia
										? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
										: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'}"
							>
								{Math.round(porcentajeBruto)}%
							</span>
						</div>

						<span class="font-mono text-xs text-zinc-500">
							<span
								class={peligro
									? 'font-bold text-red-600 dark:text-red-400'
									: 'font-semibold text-zinc-900 dark:text-zinc-100'}
							>
								${cat.gastado.toFixed(2)}
							</span>
							/ ${cat.presupuesto.toFixed(2)}
						</span>
					</div>

					<div
						class="h-2 w-full shrink-0 overflow-hidden rounded-full border border-zinc-200/50 bg-zinc-100 dark:border-zinc-700/50 dark:bg-zinc-800/80"
					>
						<div
							class="h-full rounded-full transition-all duration-1000 ease-out
                            {peligro
								? 'bg-red-500 dark:bg-red-600'
								: advertencia
									? 'bg-amber-500 dark:bg-amber-500'
									: 'bg-emerald-500 dark:bg-emerald-500'}"
							style="width: {porcentaje}%"
						></div>
					</div>

					{#if peligro}
						<p class="text-right text-[10px] font-medium text-red-500 dark:text-red-400">
							Excedido por ${(cat.gastado - cat.presupuesto).toFixed(2)}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</Card.Content>
</Card.Root>
