<script lang="ts">
	let { as = 'h1', style = '', children } = $props<{ as?: string; style?: string; children?: () => any }>();
</script>

<svelte:element this={as} class="title" style={style}>
	{@render children?.()}
</svelte:element>


