<script lang="ts">
	let {
		value = $bindable(''),
		placeholder = '',
		onenter,
		oninput,
		disabled = false
	} = $props<{
		value?: string;
		placeholder?: string;
		onenter?: () => void;
		oninput?: () => void;
		disabled?: boolean;
	}>();

	function handleInput() {
		if (oninput) {
			oninput();
		}
	}
</script>

<input
	type="text"
	bind:value
	{placeholder}
	{disabled}
	style="padding: var(--space-2) var(--space-3); background: var(--color-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-sm); color: var(--color-text); font-size: 16px; width: 100%;"
	onkeydown={(e) => {
		if (e.key === 'Enter' && onenter && !disabled) {
			onenter();
		}
	}}
	oninput={handleInput}
/>

