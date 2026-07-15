<script lang="ts">
	import BcvConverter from '$lib/components/tools/BcvConverter.svelte';
	import BinanceConverter from '$lib/components/tools/BinanceConverter.svelte';
	import RateComparison from '$lib/components/tools/RateComparison.svelte';
</script>

<div class="space-y-2 pb-10">
	<div>
		<h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Conversores</h1>
		<p class="text-sm text-zinc-500 dark:text-zinc-400">
			Calculadoras a tasa oficial e internacional.
		</p>
	</div>

	<div class="grid gap-6 pt-4 xl:grid-cols-2">
		<BcvConverter />
		<BinanceConverter />
	</div>

	<div class="mx-auto max-w-3xl pt-6">
		<RateComparison />
	</div>
</div>
