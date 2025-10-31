<script lang="ts">
	import { page } from '$app/stores';
	import Column from '$lib/component/Column.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import BooleanGates from '$lib/levels/boolean-gates/BooleanGates.svelte';
	import { getLevelConfig } from '$lib/levels/boolean-gates/config';
	import type { BooleanGatesConfig } from '$lib/levels/boolean-gates/types';

	let levelConfig: BooleanGatesConfig | null = $state(null);

	$effect(() => {
		const id = $page.url.searchParams.get('level');
		if (id?.startsWith('boolean-gates-')) {
			levelConfig = getLevelConfig(id);
		} else {
			levelConfig = null;
		}
	});
</script>

<Column gap="var(--space-6)">
	{#if levelConfig}
		<BooleanGates config={levelConfig} />
	{:else}
		<Column gap="var(--space-3)">
			<Title>No level selected</Title>
			<Subtitle>Choose one from the <a href="/levels/list">levels list</a>.</Subtitle>
		</Column>
	{/if}
</Column>


