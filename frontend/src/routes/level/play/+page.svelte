<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import Modal from '$lib/component/Modal.svelte';
	import Button from '$lib/component/Button.svelte';
	import BooleanGates from '$lib/levels/boolean-gates/BooleanGates.svelte';
	import { getLevelConfig as getBooleanGatesConfig } from '$lib/levels/boolean-gates/config';
	import type { BooleanGatesConfig } from '$lib/levels/boolean-gates/types';
	import ColorSorting from '$lib/levels/color-sorting/ColorSorting.svelte';
	import { getLevelConfig as getColorSortingConfig } from '$lib/levels/color-sorting/config';
	import type { ColorSortingConfig } from '$lib/levels/color-sorting/types';
	import ControlZone from '$lib/levels/control-zone/ControlZone.svelte';
	import { getLevelConfig as getControlZoneConfig } from '$lib/levels/control-zone/config';
	import type { ControlZoneConfig } from '$lib/levels/control-zone/types';
	import { trackLevelStart, trackLevelCompletion, getCurrentPlayer, createNewPlayer, getValidationProgress, getRequiredCompletionsForLevel } from '$lib/player-data';
	import { levels } from '$lib/levels';

	let booleanGatesConfig: BooleanGatesConfig | null = $state(null);
	let colorSortingConfig: ColorSortingConfig | null = $state(null);
	let controlZoneConfig: ControlZoneConfig | null = $state(null);
	let currentLevelId = $state<string | null>(null);
	let completionModalOpen = $state(false);
	let completionStatus: 'success' | 'failure' | null = $state(null);
	let validationProgress = $state(0);
	let requiredCompletions = $state(2); // Default to 2, will be updated based on level
	let levelKey = $state(0); // Key to force component remount for regeneration

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
			// Update required completions based on level type
			requiredCompletions = getRequiredCompletionsForLevel(id);
			// Reset modal state when level changes
			completionModalOpen = false;
			completionStatus = null;
			validationProgress = 0;
			levelKey = 0; // Reset key when level changes
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

	function handleComplete(status: 'success' | 'failure') {
		if (!currentLevelId) return;
		
		// Track completion
		trackLevelCompletion(currentLevelId, status);
		
		// Get validation progress after tracking (includes this completion)
		validationProgress = getValidationProgress(currentLevelId);
		
		// Show modal
		completionStatus = status;
		completionModalOpen = true;
	}

	function handleRetry() {
		completionModalOpen = false;
		completionStatus = null;
		validationProgress = 0;
		// Increment key to force component remount and regenerate level
		levelKey++;
		// Track a new level start for the retry
		if (currentLevelId) {
			trackLevelStart(currentLevelId);
		}
	}

	function handleNext() {
		if (!currentLevelId) return;
		
		// Find next level
		const currentIndex = levels.findIndex(l => l.id === currentLevelId);
		if (currentIndex >= 0 && currentIndex < levels.length - 1) {
			const nextLevel = levels[currentIndex + 1];
			completionModalOpen = false;
			completionStatus = null;
			validationProgress = 0;
			goto(`/level/play?level=${nextLevel.id}`);
		} else {
			// No next level, go to level list
			completionModalOpen = false;
			completionStatus = null;
			validationProgress = 0;
			goto('/levels/list');
		}
	}

	function closeModal() {
		completionModalOpen = false;
		completionStatus = null;
		validationProgress = 0;
		goto('/levels/list');
	}
</script>

<Column gap="var(--space-6)">
	{#if booleanGatesConfig}
		{#key levelKey}
			<BooleanGates config={booleanGatesConfig} oncomplete={handleComplete} />
		{/key}
	{:else if colorSortingConfig}
		{#key levelKey}
			<ColorSorting config={colorSortingConfig} oncomplete={handleComplete} />
		{/key}
	{:else if controlZoneConfig}
		{#key levelKey}
			<ControlZone config={controlZoneConfig} oncomplete={handleComplete} />
		{/key}
	{:else}
		<Column gap="var(--space-3)">
			<Title>No level selected</Title>
			<Subtitle>Choose one from the <a href="/levels/list">levels list</a>.</Subtitle>
		</Column>
	{/if}
</Column>

<Modal open={completionModalOpen} onclose={closeModal} title={validationProgress >= requiredCompletions && completionStatus === 'success' ? 'Level Validated!' : (completionStatus === 'success' ? 'Level Complete!' : 'Level Failed')}>
	<Column gap="var(--space-4)">
		{#if completionStatus === 'success'}
			{#if validationProgress >= requiredCompletions}
				<Subtitle>Level Validated! You've completed this level {requiredCompletions} times in a row.</Subtitle>
			{:else}
				<Subtitle>Congratulations! You completed this level.</Subtitle>
			{/if}
			<div style="text-align: center; font-size: 18px; font-weight: 600; color: var(--color-primary);">
				{validationProgress}/{requiredCompletions}
			</div>
		{:else}
			<Subtitle>Don't give up! Try again to master this level.</Subtitle>
			<div style="text-align: center; font-size: 18px; font-weight: 600; color: var(--color-muted);">
				0/{requiredCompletions}
			</div>
		{/if}
		<Row gap="var(--space-3)" style="justify-content: center;">
			{#if completionStatus === 'failure' || (completionStatus === 'success' && validationProgress < requiredCompletions)}
				<Button onclick={handleRetry}>Retry</Button>
			{:else if completionStatus === 'success' && validationProgress >= requiredCompletions}
				<Button onclick={handleNext}>Next</Button>
			{/if}
			<Button onclick={closeModal} variant="ghost">Go to levels list</Button>
		</Row>
	</Column>
</Modal>


