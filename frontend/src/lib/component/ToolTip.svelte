<script lang="ts">
	let { text = '', style = '', children } = $props<{ text?: string; style?: string; children?: () => any }>();
</script>

<span class="tooltip" style={style}>
	{@render children?.()}
	{#if text}
		<span class="tooltip__bubble">{text}</span>
	{/if}
</span>


