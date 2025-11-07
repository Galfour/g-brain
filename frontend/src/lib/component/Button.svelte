<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		variant = 'primary',
		disabled = false,
		onclick,
		children
	} = $props<{
		variant?: 'primary' | 'surface' | 'ghost';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
	}>();
</script>

<button class={`btn btn--${variant}`} {disabled} onclick={onclick}>
	{#if children}
		{@render children()}
	{/if}
</button>


