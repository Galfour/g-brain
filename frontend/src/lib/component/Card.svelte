<script lang="ts">
	import type { Snippet } from 'svelte';
    let { as = 'div', elevated = false, style = '', children } = $props<{
        as?: string; elevated?: boolean; style?: string; children?: Snippet;
    }>();
</script>

<svelte:element this={as} class="card" style={elevated ? 'box-shadow: var(--shadow-md);' + style : style}>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>


