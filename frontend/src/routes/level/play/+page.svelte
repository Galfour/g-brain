<script lang="ts">
	import { page } from '$app/stores';
	import Column from '$lib/component/Column.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import BooleanGates from '$lib/levels/boolean-gates/BooleanGates.svelte';
	import { getLevelConfig as getBooleanGatesConfig } from '$lib/levels/boolean-gates/config';
	import type { BooleanGatesConfig } from '$lib/levels/boolean-gates/types';
	import ColorSorting from '$lib/levels/color-sorting/ColorSorting.svelte';
	import { getLevelConfig as getColorSortingConfig } from '$lib/levels/color-sorting/config';
	import type { ColorSortingConfig } from '$lib/levels/color-sorting/types';
	import ControlZone from '$lib/levels/control-zone/ControlZone.svelte';
	import { getLevelConfig as getControlZoneConfig } from '$lib/levels/control-zone/config';
	import type { ControlZoneConfig } from '$lib/levels/control-zone/types';
	import { trackLevelStart, getCurrentPlayer, createNewPlayer } from '$lib/player-data';

	let booleanGatesConfig: BooleanGatesConfig | null = $state(null);
	let colorSortingConfig: ColorSortingConfig | null = $state(null);
	let controlZoneConfig: ControlZoneConfig | null = $state(null);
	let currentLevelId = $state<string | null>(null);

	$effect(() => {
		const id = $page.url.searchParams.get('level');
		
		// Ensure we have a current player before tracking
		if (id && !getCurrentPlayer()) {
			createNewPlayer();
		}
		
		// Track level start only when level changes
		if (id && id !== currentLevelId) {
			currentLevelId = id;
			trackLevelStart(id);
		}
		
		if (id?.startsWith('boolean-gates-')) {
			booleanGatesConfig = getBooleanGatesConfig(id);
			colorSortingConfig = null;
			controlZoneConfig = null;
		} else if (id?.startsWith('color-sorting-')) {
			colorSortingConfig = getColorSortingConfig(id);
			booleanGatesConfig = null;
			controlZoneConfig = null;
		} else if (id?.startsWith('control-zone-')) {
			controlZoneConfig = getControlZoneConfig(id);
			booleanGatesConfig = null;
			colorSortingConfig = null;
		} else {
			booleanGatesConfig = null;
			colorSortingConfig = null;
			controlZoneConfig = null;
			currentLevelId = null;
		}
	});
</script>

<Column gap="var(--space-6)">
	{#if booleanGatesConfig}
		<BooleanGates config={booleanGatesConfig} />
	{:else if colorSortingConfig}
		<ColorSorting config={colorSortingConfig} />
	{:else if controlZoneConfig}
		<ControlZone config={controlZoneConfig} />
	{:else}
		<Column gap="var(--space-3)">
			<Title>No level selected</Title>
			<Subtitle>Choose one from the <a href="/levels/list">levels list</a>.</Subtitle>
		</Column>
	{/if}
</Column>


