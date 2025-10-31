<script lang="ts">
	let { as = 'h2', style = '', children } = $props<{ as?: string; style?: string; children?: () => any }>();
</script>

<svelte:element this={as} class="subtitle" style={style}>
	{@render children?.()}
</svelte:element>


