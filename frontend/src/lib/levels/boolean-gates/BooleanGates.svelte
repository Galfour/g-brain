<script lang="ts">
	import Row from '$lib/component/Row.svelte';
	import Column from '$lib/component/Column.svelte';
	import Card from '$lib/component/Card.svelte';
	import Button from '$lib/component/Button.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import type { BooleanGatesConfig } from './types';

	let { config, children }: { config: BooleanGatesConfig; children?: any } = $props();

	// Initialize all levers OFF
	const allLevers = $state(new Array(config.maxLevers).fill(false));

	// Get active inputs in the order specified by activeLeverIndices
	const activeInputs = $derived(
		config.activeLeverIndices.map(idx => allLevers[idx])
	);
	const outputs = $derived(config.booleanFunction(activeInputs));

	// Count how many levers are currently ON
	const activeCount = $derived(allLevers.filter(Boolean).length);
	const canToggleOn = $derived(activeCount < config.maxActiveLevers);

	function toggle(i: number) {
		const newValue = !allLevers[i];
		// Only allow turning ON if under maxActiveLevers limit
		if (newValue && !canToggleOn) {
			return;
		}
		allLevers[i] = newValue;
	}
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>{config.title}</Title>
		<Subtitle>{config.subtitle}</Subtitle>
	</Column>

	<Row gap="var(--space-6)">
		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">Levers</div>
				<Row gap="var(--space-3)">
					{#each allLevers as on, i}
						<Button 
							variant={on ? 'primary' : 'surface'} 
							onclick={() => toggle(i)}
							disabled={!on && !canToggleOn}
						>
							{on ? `Lever ${i+1}: ON` : `Lever ${i+1}: OFF`}
						</Button>
					{/each}
				</Row>
				<div class="subtitle" style="font-size: 12px; color: var(--color-muted);">
					Maximum {config.maxActiveLevers} lever{config.maxActiveLevers > 1 ? 's' : ''} can be ON at once
					({activeCount}/{config.maxActiveLevers} currently ON)
				</div>
			</Column>
		</Card>

		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">Outputs</div>
				<Row gap="var(--space-3)">
					{#each outputs as open, i}
						<div class="card" style={`padding: var(--space-4); border-color:${open ? 'var(--color-primary)' : 'var(--color-border)'};`}>
							Output {i+1}: {open ? 'TRUE' : 'FALSE'}
						</div>
					{/each}
				</Row>
				{#if outputs.every(Boolean)}
					<div style="color: var(--color-primary); font-weight: 700;">All outputs TRUE! ✔</div>
				{/if}
			</Column>
		</Card>
	</Row>

	{@render children?.()}
</Column>
