<script lang="ts">
	let {
		variant = 'primary',
		disabled = false,
		onclick,
		children
	} = $props<{
		variant?: 'primary' | 'surface' | 'ghost';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: () => any;
	}>();
</script>

<button class={`btn btn--${variant}`} {disabled} onclick={onclick}>
	{@render children?.()}
</button>


