<script lang="ts">
	import { flip } from 'svelte/animate';
	import Row from '$lib/component/Row.svelte';
	import Column from '$lib/component/Column.svelte';
	import Card from '$lib/component/Card.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import type { ColorSortingConfig } from './types';
	import { sortColorsByProperty, isSorted } from './types';

	let { config, children }: { config: ColorSortingConfig; children?: any } = $props();

	// Generate different colors for example and input
	const exampleColors = $state(config.generateColors());
	const inputColors = $state(config.generateColors());
	
	const correctOrder = $derived(sortColorsByProperty([...exampleColors], config.property));
	const correctInputOrder = $derived(sortColorsByProperty([...inputColors], config.property));
	
	// User's current order (starts shuffled)
	const userOrder = $state([...inputColors]);
	
	// Check if sorted correctly
	const isCorrect = $derived(isSorted(userOrder, config.property, correctInputOrder));

	function swap(index: number) {
		if (index >= userOrder.length - 1) return;
		const temp = userOrder[index];
		userOrder[index] = userOrder[index + 1];
		userOrder[index + 1] = temp;
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
				<div class="subtitle">Example (Correct Order)</div>
				<Row gap="var(--space-2)" style="flex-wrap: wrap;">
					{#each correctOrder as color}
						<div
							style="width: 48px; height: 48px; background: {color}; border-radius: var(--radius-sm); border: 1px solid var(--color-border);"
						></div>
					{/each}
				</Row>
			</Column>
		</Card>

		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">Your Order {#if isCorrect}<span style="color: var(--color-primary);">✓ Correct!</span>{/if}</div>
				<div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1);">
					{#each userOrder as color, colorIndex (color)}
						<div
							animate:flip={{ duration: 300 }}
							style="width: 48px; height: 48px; background: {color}; border-radius: var(--radius-sm); border: 1px solid var(--color-border); order: {colorIndex * 2};"
						></div>
					{/each}
					{#each Array(userOrder.length - 1) as _, i}
						<button
							class="btn btn--ghost"
							onclick={() => swap(i)}
							aria-label="Swap colors"
							style="padding: var(--space-1); min-width: 32px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; order: {(i + 1) * 2 - 1};"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 4L2 8L6 12M10 4L14 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
					{/each}
				</div>
				<div style="font-size: 12px; color: var(--color-muted);">
					Click the swap icons to reorder colors
				</div>
			</Column>
		</Card>
	</Row>

	{@render children?.()}
</Column>

