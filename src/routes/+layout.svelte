<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { Wallet } from 'lucide-svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import MobileNav from '$lib/components/layout/MobileNav.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';

	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" />

<div class="flex min-h-screen bg-zinc-50 transition-colors duration-300 dark:bg-zinc-950">
	<Sidebar />

	<main class="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto pb-16 md:pb-0">
		<header
			class="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950"
		>
			<div class="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
				<Wallet class="h-5 w-5 text-blue-600 dark:text-blue-500" />
				Finance
			</div>
			<ThemeToggle />
		</header>

		<div class="flex-1 p-4 md:p-8">
			<div class="mx-auto w-full max-w-6xl">
				{@render children()}
			</div>
		</div>
	</main>

	<MobileNav />
</div>
