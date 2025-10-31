<script lang="ts">
    let {
        as = 'div',
        gap = 'var(--space-4)',
        align = 'stretch',
        justify = 'flex-start',
        padding,
        style = '',
        children
    } = $props<{
        as?: string;
        gap?: string | number;
        align?: string;
        justify?: string;
        padding?: string | number;
        style?: string;
        children?: () => any;
    }>();

	const gapValue = typeof gap === 'number' ? `${gap}px` : gap;
	const paddingValue = padding === undefined ? undefined : typeof padding === 'number' ? `${padding}px` : padding;

</script>

<svelte:element
	this={as}
	style={`display:flex; flex-direction:column; gap:${gapValue}; align-items:${align}; justify-content:${justify};${paddingValue ? ` padding:${paddingValue};` : ''} ${style}`}
>
	{@render children?.()}
</svelte:element>


