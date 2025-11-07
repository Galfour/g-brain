<script lang="ts">
	import type { Snippet } from 'svelte';
	import Column from '$lib/component/Column.svelte';
	import Card from '$lib/component/Card.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import TextInput from '$lib/component/TextInput.svelte';
	import MultipleChoice from '$lib/component/MultipleChoice.svelte';
	import Button from '$lib/component/Button.svelte';
	import type { FillEstimationConfig } from './types';
	import { generateMultipleChoiceOptions } from './config';

	let { config, oncomplete, children }: { config: FillEstimationConfig; oncomplete?: (status: 'success' | 'failure', scores?: Record<string, number>) => void; children?: Snippet } = $props();

	// Generate fill percentage for this round
	const fillPercentage = $state(config.generateFillPercentage());
	
	// User's answer - for multiple choice (string | null) or text input (string)
	let userAnswer = $state<string | null>(null);
	let userInputText = $state<string>('');
	
	// For easy levels: multiple choice options
	const isEasyLevel = $derived(config.difficulty === 'easy');
	const multipleChoiceOptions = $derived(
		isEasyLevel
			? generateMultipleChoiceOptions(fillPercentage, config.tolerance).map(p => `${p}%`)
			: []
	);
	
	// Get the actual answer string for checking
	const answerString = $derived(isEasyLevel ? userAnswer : userInputText);
	
	// Check if answer is correct
	const isCorrect = $derived.by(() => {
		if (!answerString || answerString.trim() === '') return false;
		
		if (isEasyLevel) {
			// For multiple choice, check exact match
			return answerString === `${fillPercentage}%`;
		} else {
			// For input, parse number and check tolerance
			const answerNum = parseFloat(answerString.replace('%', '').trim());
			if (isNaN(answerNum)) return false;
			const difference = Math.abs(answerNum - fillPercentage);
			return difference <= config.tolerance;
		}
	});
	
	// Track if completion has been called
	let completionCalled = $state(false);
	
	// Handle answer submission
	function handleSubmit() {
		if (!answerString || answerString.trim() === '' || completionCalled) return;
		
		completionCalled = true;
		
		if (isCorrect && oncomplete) {
			oncomplete('success');
		} else if (oncomplete) {
			oncomplete('failure');
		}
	}
	
	// Auto-submit for multiple choice
	$effect(() => {
		if (isEasyLevel && userAnswer && !completionCalled) {
			handleSubmit();
		}
	});
	
	// Shape rendering constants
	const size = 200;
	const radius = size / 2 - 10;
	const circumference = 2 * Math.PI * radius;
	const offset = $derived(circumference - (fillPercentage / 100) * circumference);
	
	// For square: calculate sub-square size (area-based)
	const squareFillSize = $derived(Math.sqrt(fillPercentage / 100) * size);
	
	// For disk-filled: calculate filled radius (area-based)
	const diskFillRadius = $derived(Math.sqrt(fillPercentage / 100) * radius);
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>{config.title}</Title>
		<Subtitle>{config.subtitle}</Subtitle>
	</Column>

		<Card>
		<Column gap="var(--space-6)" style="align-items: center;">
			<div class="subtitle">Estimate the fill percentage</div>
			
			{#if config.shape === 'gauge'}
				<div style="width: {size}px; height: 40px; background: var(--color-elevated); border: 2px solid var(--color-border); border-radius: var(--radius-sm); position: relative; overflow: hidden;">
					<div style="width: {fillPercentage}%; height: 100%; background: var(--color-primary); transition: width 0.3s ease;"></div>
				</div>
			{:else if config.shape === 'square'}
				<div style="width: {size}px; height: {size}px; background: var(--color-elevated); border: 2px solid var(--color-border); border-radius: var(--radius-sm); position: relative; display: flex; align-items: center; justify-content: center;">
					<div style="width: {squareFillSize}px; height: {squareFillSize}px; background: var(--color-primary); transition: width 0.3s ease, height 0.3s ease;"></div>
				</div>
			{:else if config.shape === 'disk-ring'}
				<div style="width: {size}px; height: {size}px; position: relative;">
					<svg width={size} height={size} style="transform: rotate(-90deg);">
						<circle
							cx={size / 2}
							cy={size / 2}
							r={radius}
							fill="none"
							stroke="var(--color-elevated)"
							stroke-width="20"
						/>
						<circle
							cx={size / 2}
							cy={size / 2}
							r={radius}
							fill="none"
							stroke="var(--color-primary)"
							stroke-width="20"
							stroke-dasharray={circumference}
							stroke-dashoffset={offset}
							stroke-linecap="round"
							style="transition: stroke-dashoffset 0.3s ease;"
						/>
					</svg>
				</div>
			{:else if config.shape === 'disk-filled'}
				<div style="width: {size}px; height: {size}px; position: relative;">
					<svg width={size} height={size}>
						<!-- Outer circle (background) -->
						<circle
							cx={size / 2}
							cy={size / 2}
							r={radius}
							fill="var(--color-elevated)"
							stroke="var(--color-border)"
							stroke-width="2"
						/>
						<!-- Filled circle (concentric subdisk) -->
						<circle
							cx={size / 2}
							cy={size / 2}
							r={diskFillRadius}
							fill="var(--color-primary)"
							style="transition: r 0.3s ease;"
						/>
					</svg>
				</div>
			{/if}
			
			{#if isEasyLevel}
				<Column gap="var(--space-4)" style="width: 100%;">
					<MultipleChoice
						bind:selected={userAnswer}
						options={multipleChoiceOptions}
						disabled={completionCalled}
					/>
					{#if completionCalled}
						<div style="text-align: center; padding: var(--space-2); border-radius: var(--radius-sm); background: {isCorrect ? 'var(--color-primary)' : 'var(--color-error)'}; color: white; opacity: 0.9;">
							{#if isCorrect}
								<div style="font-weight: 600;">✓ Correct!</div>
							{:else}
								<div style="font-weight: 600;">✗ Incorrect</div>
							{/if}
							<div style="font-size: 14px; margin-top: var(--space-1);">The answer was {fillPercentage}%</div>
						</div>
					{/if}
				</Column>
			{:else}
				<Column gap="var(--space-4)" style="width: 100%; max-width: 300px;">
					<TextInput
						bind:value={userInputText}
						placeholder="Enter percentage (e.g., 45%)"
						disabled={completionCalled}
						onenter={handleSubmit}
					/>
					<Button
						onclick={handleSubmit}
						disabled={!userInputText || userInputText.trim() === '' || completionCalled}
					>
						Submit
					</Button>
					{#if completionCalled}
						<div style="text-align: center; padding: var(--space-2); border-radius: var(--radius-sm); background: {isCorrect ? 'var(--color-primary)' : 'var(--color-error)'}; color: white; opacity: 0.9;">
							{#if isCorrect}
								<div style="font-weight: 600;">✓ Correct!</div>
							{:else}
								<div style="font-weight: 600;">✗ Incorrect</div>
								<div style="font-size: 12px; margin-top: var(--space-1);">You needed to be within {config.tolerance}%</div>
							{/if}
							<div style="font-size: 14px; margin-top: var(--space-1);">The answer was {fillPercentage}%</div>
							{#if !isCorrect && answerString}
								{@const userNum = parseFloat(answerString.replace('%', '').trim())}
								{#if !isNaN(userNum)}
									<div style="font-size: 12px; margin-top: var(--space-1);">Your answer: {userNum}% (off by {Math.abs(userNum - fillPercentage).toFixed(1)}%)</div>
								{/if}
							{/if}
						</div>
					{/if}
					<div style="font-size: 12px; color: var(--color-muted); text-align: center;">
						Must be within {config.tolerance}% of the correct answer
					</div>
				</Column>
			{/if}
		</Column>
	</Card>

	{#if children}
		{@render children()}
	{/if}
</Column>

