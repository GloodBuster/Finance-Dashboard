<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<Button variant="ghost" size="icon" onclick={toggleMode} class="rounded-full hover:cursor-pointer">
	<Sun
		class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 text-zinc-600 transition-all dark:scale-0 dark:-rotate-90"
	/>
	<Moon
		class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 text-zinc-300 transition-all dark:scale-100 dark:rotate-0"
	/>
	<span class="sr-only">Cambiar tema</span>
</Button>
