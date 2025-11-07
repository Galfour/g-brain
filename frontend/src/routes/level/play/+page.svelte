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
	import FormalWords from '$lib/levels/formal-words/FormalWords.svelte';
	import { getLevelConfig as getFormalWordsConfig } from '$lib/levels/formal-words/config';
	import type { FormalWordsConfig } from '$lib/levels/formal-words/types';
	import Lesson from '$lib/levels/lesson/Lesson.svelte';
	import { getLessonConfig } from '$lib/levels/lesson/config';
	import type { LessonConfig } from '$lib/levels/lesson/types';
	import { trackLevelStart, trackLevelCompletion, getCurrentPlayer, createNewPlayer, getValidationProgress, getRequiredCompletionsForLevel } from '$lib/player-data';
	import { levels } from '$lib/levels';

	type LevelConfig = BooleanGatesConfig | ColorSortingConfig | ControlZoneConfig | FormalWordsConfig;

	type LevelRegistry = {
		prefix: string;
		getConfig: (id: string) => LevelConfig | null;
	};

	const levelRegistry: LevelRegistry[] = [
		{
			prefix: 'boolean-gates-',
			getConfig: getBooleanGatesConfig
		},
		{
			prefix: 'color-sorting-',
			getConfig: getColorSortingConfig
		},
		{
			prefix: 'control-zone-',
			getConfig: getControlZoneConfig
		},
		{
			prefix: 'formal-words-',
			getConfig: getFormalWordsConfig
		}
	];

	let currentLevelId = $state<string | null>(null);
	let currentConfig = $state<LevelConfig | null>(null);
	let currentLessonConfig = $state<LessonConfig | null>(null);
	let currentLevelType = $state<'boolean-gates' | 'color-sorting' | 'control-zone' | 'formal-words' | 'lesson' | null>(null);
	let completionModalOpen = $state(false);
	let completionStatus: 'success' | 'failure' | null = $state(null);
	let validationProgress = $state(0);
	let requiredCompletions = $state(2);
	let levelKey = $state(0);

	function resetModalState() {
		completionModalOpen = false;
		completionStatus = null;
		validationProgress = 0;
	}

	function findLevelRegistry(levelId: string): LevelRegistry | null {
		return levelRegistry.find(registry => levelId.startsWith(registry.prefix)) ?? null;
	}

	// Track the URL level parameter to detect changes
	const urlLevelId = $derived($page.url.searchParams.get('level'));
	
	// Use a non-reactive variable to track previous level ID and avoid infinite loops
	let previousLevelId: string | null = null;
	
	$effect(() => {
		const id = urlLevelId;
		
		if (id && !getCurrentPlayer()) {
			createNewPlayer();
		}
		
		// Only update when the level ID actually changes (using non-reactive previousLevelId)
		if (id !== previousLevelId) {
			previousLevelId = id;
			
			if (id) {
				currentLevelId = id;
				trackLevelStart(id);
				requiredCompletions = getRequiredCompletionsForLevel(id);
				resetModalState();
				levelKey = 0;
				
				if (id.startsWith('lesson-')) {
					currentLessonConfig = getLessonConfig(id);
					currentLevelType = currentLessonConfig ? 'lesson' : null;
					currentConfig = null;
				} else {
					const registry = findLevelRegistry(id);
					if (registry) {
						currentConfig = registry.getConfig(id);
						currentLevelType = registry.prefix.slice(0, -1) as 'boolean-gates' | 'color-sorting' | 'control-zone' | 'formal-words';
						currentLessonConfig = null;
					} else {
						currentConfig = null;
						currentLevelType = null;
						currentLessonConfig = null;
					}
				}
			} else {
				currentLevelId = null;
				currentConfig = null;
				currentLessonConfig = null;
				currentLevelType = null;
			}
		}
	});

	function handleComplete(status: 'success' | 'failure', scores?: Record<string, number>) {
		if (!currentLevelId) return;
		
		trackLevelCompletion(currentLevelId, status, scores);
		validationProgress = getValidationProgress(currentLevelId);
		completionStatus = status;
		completionModalOpen = true;
	}

	function handleRetry() {
		resetModalState();
		levelKey++;
		if (currentLevelId) {
			trackLevelStart(currentLevelId);
		}
	}

	function handleNext() {
		if (!currentLevelId) return;
		
		const currentIndex = levels.findIndex(l => l.id === currentLevelId);
		if (currentIndex >= 0 && currentIndex < levels.length - 1) {
			const nextLevel = levels[currentIndex + 1];
			resetModalState();
			goto(`/level/play?level=${nextLevel.id}`);
		} else {
			resetModalState();
			goto('/levels/list');
		}
	}

	function closeModal() {
		resetModalState();
		goto('/levels/list');
	}

	const modalTitle = $derived(
		validationProgress >= requiredCompletions && completionStatus === 'success'
			? 'Level Validated!'
			: completionStatus === 'success'
				? 'Level Complete!'
				: completionStatus === 'failure'
					? 'Level Failed'
					: ''
	);

	const isLevelValidated = $derived(validationProgress >= requiredCompletions && completionStatus === 'success');
	const showRetryButton = $derived(completionStatus === 'failure' || (completionStatus === 'success' && !isLevelValidated));
</script>

<Column gap="var(--space-6)">
	{#if currentLevelType === 'lesson' && currentLessonConfig}
		{#key levelKey}
			<Lesson config={currentLessonConfig} oncomplete={handleComplete} />
		{/key}
	{:else if currentLevelType === 'boolean-gates' && currentConfig}
		{#key levelKey}
			<BooleanGates config={currentConfig as BooleanGatesConfig} oncomplete={handleComplete} />
		{/key}
	{:else if currentLevelType === 'color-sorting' && currentConfig}
		{#key levelKey}
			<ColorSorting config={currentConfig as ColorSortingConfig} oncomplete={handleComplete} />
		{/key}
	{:else if currentLevelType === 'control-zone' && currentConfig}
		{#key levelKey}
			<ControlZone config={currentConfig as ControlZoneConfig} oncomplete={handleComplete} />
		{/key}
	{:else if currentLevelType === 'formal-words' && currentConfig}
		{#key levelKey}
			<FormalWords config={currentConfig as FormalWordsConfig} oncomplete={handleComplete} />
		{/key}
	{:else}
		<Column gap="var(--space-3)">
			<Title>No level selected</Title>
			<Subtitle>Choose one from the <a href="/levels/list">levels list</a>.</Subtitle>
		</Column>
	{/if}
</Column>

<Modal open={completionModalOpen} onclose={closeModal} title={modalTitle}>
	<Column gap="var(--space-4)">
		{#if completionStatus === 'success'}
			{#if isLevelValidated}
				<Subtitle>Level Validated! You've completed this level {requiredCompletions} times in a row.</Subtitle>
			{:else}
				<Subtitle>Congratulations! You completed this level.</Subtitle>
			{/if}
			<div style="text-align: center; font-size: 18px; font-weight: 600; color: var(--color-primary);">
				{validationProgress}/{requiredCompletions}
			</div>
		{:else if completionStatus === 'failure'}
			<Subtitle>Don't give up! Try again to master this level.</Subtitle>
			<div style="text-align: center; font-size: 18px; font-weight: 600; color: var(--color-muted);">
				0/{requiredCompletions}
			</div>
		{/if}
		<Row gap="var(--space-3)" style="justify-content: center;">
			{#if showRetryButton}
				<Button onclick={handleRetry}>Retry</Button>
			{:else if isLevelValidated}
				<Button onclick={handleNext}>Next</Button>
			{/if}
			<Button onclick={closeModal} variant="ghost">Go to levels list</Button>
		</Row>
	</Column>
</Modal>


