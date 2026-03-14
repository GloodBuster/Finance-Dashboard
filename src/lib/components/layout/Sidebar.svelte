<script lang="ts">
	import { LayoutDashboard, ReceiptText, Settings, Wallet } from 'lucide-svelte';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import ThemeToggle from '../ui/ThemeToggle.svelte';
</script>

<aside
	class="sticky top-0 hidden h-screen w-64 flex-col border-r border-zinc-200 bg-white md:flex dark:border-zinc-800 dark:bg-zinc-950"
>
	<div
		class="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800"
	>
		<div class="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
			<Wallet class="h-6 w-6 text-blue-600 dark:text-blue-500" />
			Finance
		</div>
		<ThemeToggle />
	</div>

	<nav class="flex-1 space-y-2 px-4 py-6">
		<Button
			href="/"
			variant={page.url.pathname === '/' ? 'secondary' : 'ghost'}
			class="w-full justify-start gap-3"
		>
			<LayoutDashboard class="h-5 w-5" />
			Dashboard
		</Button>

		<Button
			href="/movimientos"
			variant={page.url.pathname.includes('/movimientos') ? 'secondary' : 'ghost'}
			class="w-full justify-start gap-3"
		>
			<ReceiptText class="h-5 w-5" />
			Movimientos
		</Button>
	</nav>

	<div class="border-t border-zinc-200 p-4 dark:border-zinc-800">
		<Button
			href="/ajustes"
			variant={page.url.pathname.includes('/ajustes') ? 'secondary' : 'ghost'}
			class="w-full justify-start gap-3 text-zinc-500"
		>
			<Settings class="h-5 w-5" />
			Ajustes
		</Button>
	</div>
</aside>
