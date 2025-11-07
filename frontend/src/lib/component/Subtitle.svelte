<script lang="ts">
	import type { Snippet } from 'svelte';
	let { as = 'h2', style = '', children } = $props<{ as?: string; style?: string; children?: Snippet }>();
</script>

<svelte:element this={as} class="subtitle" style={style}>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>


