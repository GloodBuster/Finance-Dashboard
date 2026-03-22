<script lang="ts">
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Calculator } from 'lucide-svelte';
	import BcvConverter from '$lib/components/tools/BcvConverter.svelte';

	// Variables de estado para controlar si está abierto y si es PC
	let open = $state(false);
	let isDesktop = $state(false);

	// Verificamos el tamaño de la pantalla al cargar y al redimensionar
	onMount(() => {
		const checkDesktop = () => (isDesktop = window.innerWidth >= 768);
		checkDesktop(); // Chequeo inicial

		window.addEventListener('resize', checkDesktop);
		return () => window.removeEventListener('resize', checkDesktop);
	});
</script>

<button
	onclick={() => (open = true)}
	class="fixed right-4 bottom-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all hover:bg-emerald-700 active:scale-95 md:right-8 md:bottom-8"
	aria-label="Abrir calculadora"
>
	<Calculator class="h-6 w-6" />
</button>

{#if isDesktop}
	<Dialog.Root bind:open>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title class="text-center">Conversor BCV</Dialog.Title>
				<Dialog.Description class="text-center">Cálculo rápido a tasa oficial</Dialog.Description>
			</Dialog.Header>
			<div class="mt-4">
				<BcvConverter />
			</div>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-md p-4">
				<BcvConverter />
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
