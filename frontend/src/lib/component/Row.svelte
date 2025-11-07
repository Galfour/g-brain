<script lang="ts">
	import type { Snippet } from 'svelte';
    let {
        as = 'div',
        gap = 'var(--space-4)',
        align = 'center',
        justify = 'flex-start',
        wrap = false,
        padding,
        style = '',
        children
    } = $props<{
        as?: string;
        gap?: string | number;
        align?: string;
        justify?: string;
        wrap?: boolean;
        padding?: string | number;
        style?: string;
        children?: Snippet;
    }>();

	const gapValue = typeof gap === 'number' ? `${gap}px` : gap;
	const paddingValue = padding === undefined ? undefined : typeof padding === 'number' ? `${padding}px` : padding;

</script>

<svelte:element
	this={as}
	style={`display:flex; flex-direction:row; gap:${gapValue}; align-items:${align}; justify-content:${justify}; flex-wrap:${wrap ? 'wrap' : 'nowrap'};${paddingValue ? ` padding:${paddingValue};` : ''} ${style}`}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>


