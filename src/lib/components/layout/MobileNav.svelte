<script lang="ts">
	import { LayoutDashboard, ReceiptText, Settings } from 'lucide-svelte';
	import { page } from '$app/state';
</script>

<nav
	class="pb-safe fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-200 bg-white/90 backdrop-blur-lg md:hidden dark:border-zinc-800 dark:bg-zinc-950/90"
>
	<div class="flex h-16 items-center justify-around px-2">
		<a
			href="/"
			class="flex h-full w-full flex-col items-center justify-center gap-1 {page.url.pathname ===
			'/'
				? 'text-blue-600 dark:text-blue-500'
				: 'text-zinc-500 dark:text-zinc-400'}"
		>
			<LayoutDashboard class="h-5 w-5" />
			<span class="text-[10px] font-medium">Inicio</span>
		</a>
		<a
			href="/movimientos"
			class="flex h-full w-full flex-col items-center justify-center gap-1 {page.url.pathname.includes(
				'/movimientos'
			)
				? 'text-blue-600 dark:text-blue-500'
				: 'text-zinc-500 dark:text-zinc-400'}"
		>
			<ReceiptText class="h-5 w-5" />
			<span class="text-[10px] font-medium">Historial</span>
		</a>
		<a
			href="/ajustes"
			class="flex h-full w-full flex-col items-center justify-center gap-1 {page.url.pathname.includes(
				'/ajustes'
			)
				? 'text-blue-600 dark:text-blue-500'
				: 'text-zinc-500 dark:text-zinc-400'}"
		>
			<Settings class="h-5 w-5" />
			<span class="text-[10px] font-medium">Ajustes</span>
		</a>
	</div>
</nav>
