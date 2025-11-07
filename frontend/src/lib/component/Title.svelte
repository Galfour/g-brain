<script lang="ts">
	import type { Snippet } from 'svelte';
	let { as = 'h1', style = '', children } = $props<{ as?: string; style?: string; children?: Snippet }>();
</script>

<svelte:element this={as} class="title" style={style}>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>


