<script lang="ts">
	import { cn } from '$lib/utils';
	let { class: className = '', ...restProps } = $props();
</script>

<div 
	class={cn('animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800', className)} 
	{...restProps}
></div>