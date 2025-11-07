<script lang="ts">
	import { flip } from 'svelte/animate';
	import Row from '$lib/component/Row.svelte';
	import Column from '$lib/component/Column.svelte';
	import Card from '$lib/component/Card.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import TextWithTooltips from '$lib/component/TextWithTooltips.svelte';
	import type { ColorSortingConfig, RGB } from './types';
	import { sortColorsByProperty, isSorted, rgbToCss } from './types';
	import { m } from '$lib/paraglide/messages.js';

	let { config, oncomplete, children }: { config: ColorSortingConfig; oncomplete?: (status: 'success' | 'failure', scores?: Record<string, number>) => void; children?: any } = $props();

	// Determine if this is an easy level (numColors <= 10)
	const isEasyLevel = config.numColors <= 10;
	const numExamples = isEasyLevel ? 3 : 1;
	
	// Generate different colors for examples and input
	const exampleColorSets = $state(
		Array.from({ length: numExamples }, () => config.generateColors())
	);
	const inputColors = $state(config.generateColors());
	
	const exampleOrders = $derived(
		exampleColorSets.map(colors => sortColorsByProperty([...colors], config.property))
	);
	const correctInputOrder = $derived(sortColorsByProperty([...inputColors], config.property));
	
	// User's current order (starts shuffled)
	const userOrder = $state([...inputColors]);
	
	// Check if sorted correctly
	const isCorrect = $derived(isSorted(userOrder, config.property, correctInputOrder));

	// Track if completion has been called to avoid multiple calls
	let completionCalled = $state(false);
	
	// Track number of swaps
	let swapCount = $state(0);

	function swap(index: number) {
		if (index >= userOrder.length - 1) return;
		const temp = userOrder[index];
		userOrder[index] = userOrder[index + 1];
		userOrder[index + 1] = temp;
		swapCount++;
		// Reset completion flag when player makes a change
		completionCalled = false;
	}

	// Call oncomplete when sorted correctly
	$effect(() => {
		if (isCorrect && !completionCalled && oncomplete) {
			completionCalled = true;
			const scores: Record<string, number> = { swaps: swapCount };
			oncomplete('success', scores);
		}
	});

	// Create interleaved array of colors and swap buttons
	const items = $derived(
		userOrder.flatMap((color, index) => {
			const items: Array<{ type: 'color'; content: RGB } | { type: 'swap'; content: number }> = [
				{ type: 'color', content: color }
			];
			if (index < userOrder.length - 1) {
				items.push({ type: 'swap', content: index });
			}
			return items;
		})
	);

</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>
			<TextWithTooltips text={config.title} wordExplanations={config.wordExplanations} />
		</Title>
		<Subtitle>
			<TextWithTooltips text={config.subtitle} wordExplanations={config.wordExplanations} />
		</Subtitle>
	</Column>

	<Row gap="var(--space-6)">
		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">{numExamples > 1 ? m.color_sorting_examples() : m.color_sorting_example()} (Correct Order)</div>
				<Column gap="var(--space-3)">
					{#each exampleOrders as exampleOrder}
						<Row gap="var(--space-2)" style="flex-wrap: wrap;">
							{#each exampleOrder as color}
								<div
									style="width: 48px; height: 48px; background: {rgbToCss(color)}; border-radius: var(--radius-sm); border: 1px solid var(--color-border);"
								></div>
							{/each}
						</Row>
					{/each}
				</Column>
			</Column>
		</Card>

		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">{m.color_sorting_your_order()} {#if isCorrect}<span style="color: var(--color-primary);">{m.color_sorting_correct()}</span>{/if}</div>
				<div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1);">
					{#each items as item (item.content)}
						<div
							animate:flip={{ duration: 300 }}
						>
							{#if item.type === 'color'}
								<div
									style="width: 48px; height: 48px; background: {rgbToCss(item.content)}; border-radius: var(--radius-sm); border: 1px solid var(--color-border);"
								></div>
							{:else}
								<button
									class="btn btn--ghost"
									onclick={() => swap(item.content)}
									aria-label={m.color_sorting_swap_aria()}
									style="padding: var(--space-1); min-width: 32px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;"
								>
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M6 4L2 8L6 12M10 4L14 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</button>
							{/if}
						</div>
					{/each}
				</div>
				<div style="font-size: 12px; color: var(--color-muted);">
					{m.color_sorting_swap_hint()}
				</div>
			</Column>
		</Card>
	</Row>

	{@render children?.()}
</Column>

