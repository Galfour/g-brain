<script lang="ts">
	import type { Snippet } from 'svelte';
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Card from '$lib/component/Card.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import TextInput from '$lib/component/TextInput.svelte';
	import BinaryChoice from '$lib/component/BinaryChoice.svelte';
	import MultipleChoice from '$lib/component/MultipleChoice.svelte';
	import Button from '$lib/component/Button.svelte';
	import TextWithTooltips from '$lib/component/TextWithTooltips.svelte';
	import type { FormalWordsConfig } from './types';
	import { m } from '$lib/paraglide/messages.js';

	let { config, oncomplete, children }: { config: FormalWordsConfig; oncomplete?: (status: 'success' | 'failure', scores?: Record<string, number>) => void; children?: Snippet } = $props();

	// Generate question on mount
	const question = $state(config.generateQuestion());
	let userAnswer = $state<string>('');
	let selectedBinary = $state<string | null>(null);
	let selectedMultiple = $state<string | null>(null);
	
	let submitted = $state(false);
	let submissionResult: 'correct' | 'incorrect' | null = $state(null);
	
	// Track number of attempts
	let attemptCount = $state(0);

	// Get current answer based on answer type
	const currentAnswer = $derived(() => {
		if (config.answerType === 'text') {
			return userAnswer.trim();
		} else if (config.answerType === 'binary') {
			return selectedBinary || '';
		} else {
			return selectedMultiple || '';
		}
	});

	// Check if answer is correct
	const isCorrect = $derived(() => {
		const answer = currentAnswer();
		return answer.toLowerCase() === question.correctAnswer.toLowerCase();
	});

	// Check if answer is ready to submit
	const canSubmit = $derived(() => {
		if (config.answerType === 'text') {
			return userAnswer.trim() !== '';
		} else if (config.answerType === 'binary') {
			return selectedBinary !== null;
		} else {
			return selectedMultiple !== null;
		}
	});

	function submitAnswer() {
		if (!canSubmit()) return;
		
		attemptCount++;
		submitted = true;
		const correct = isCorrect();
		submissionResult = correct ? 'correct' : 'incorrect';
		
		if (oncomplete) {
			if (correct) {
				const scores: Record<string, number> = { attempts: attemptCount };
				oncomplete('success', scores);
			} else {
				oncomplete('failure');
			}
		}
	}

	// Reset when user changes answer after submission
	function handleAnswerChange() {
		if (submitted) {
			submitted = false;
			submissionResult = null;
		}
	}
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
				<div class="subtitle">{m.formal_words_example()}</div>
				<div style="font-size: 14px; color: var(--color-muted);">
					<TextWithTooltips text={question.example} wordExplanations={config.wordExplanations} />
				</div>
			</Column>
		</Card>

		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle" style="font-size: 18px;">
					<TextWithTooltips text={question.prompt} wordExplanations={config.wordExplanations} />
				</div>
				
				{#if config.answerType === 'text'}
					<TextInput
						bind:value={userAnswer}
						placeholder={m.formal_words_type_answer()}
						onenter={submitAnswer}
						oninput={handleAnswerChange}
					/>
				{:else if config.answerType === 'binary'}
					{@const binaryOptions = question.options as [string, string]}
					<BinaryChoice
						options={binaryOptions}
						bind:selected={selectedBinary}
						onchange={handleAnswerChange}
					/>
				{:else if config.answerType === 'multiple-choice'}
					<MultipleChoice
						options={question.options || []}
						bind:selected={selectedMultiple}
						onchange={handleAnswerChange}
					/>
				{/if}

				<Button onclick={submitAnswer} disabled={!canSubmit()}>
					{m.formal_words_submit()}
				</Button>

				{#if submitted}
					{#if submissionResult === 'correct'}
						<div style="color: var(--color-primary); font-weight: 600;">{m.formal_words_correct()}</div>
					{:else if submissionResult === 'incorrect'}
						<div style="color: var(--color-error, #ff4444); font-weight: 600;">{m.formal_words_incorrect()}</div>
					{/if}
				{/if}
			</Column>
		</Card>
	</Row>

	{#if children}
		{@render children()}
	{/if}
</Column>

