<script lang="ts">
    let { as = 'div', elevated = false, style = '', children } = $props<{
        as?: string; elevated?: boolean; style?: string; children?: () => any;
    }>();
</script>

<svelte:element this={as} class="card" style={elevated ? 'box-shadow: var(--shadow-md);' + style : style}>
	{@render children?.()}
</svelte:element>


