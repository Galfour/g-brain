<script lang="ts">
	import Button from './Button.svelte';

	let {
		options = $bindable<string[]>([]),
		selected = $bindable<string | null>(null),
		disabled = false,
		onchange
	} = $props<{
		options?: string[];
		selected?: string | null;
		disabled?: boolean;
		onchange?: () => void;
	}>();

	function select(option: string) {
		if (disabled) return;
		selected = option;
		if (onchange) {
			onchange();
		}
	}
</script>

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3);">
	{#each options as option}
		<Button
			variant={selected === option ? 'primary' : 'surface'}
			onclick={() => select(option)}
			{disabled}
		>
			{option}
		</Button>
	{/each}
</div>

