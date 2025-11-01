<script lang="ts">
	import ToolTip from './ToolTip.svelte';

	type Props = {
		text: string;
		wordExplanations?: Record<string, string>;
	};

	let { text, wordExplanations = {} }: Props = $props();

	// Split text into parts, wrapping special words with tooltips
	function renderTextWithTooltips(): Array<{ type: 'text' | 'tooltip'; content: string; word?: string; explanation?: string }> {
		if (!wordExplanations || Object.keys(wordExplanations).length === 0) {
			return [{ type: 'text', content: text }];
		}

		const parts: Array<{ type: 'text' | 'tooltip'; content: string; word?: string; explanation?: string }> = [];
		let lastIndex = 0;

		// Find all occurrences of words that have explanations
		const wordMatches: Array<{ word: string; index: number; length: number; explanation: string }> = [];
		
		for (const [word, explanation] of Object.entries(wordExplanations)) {
			// Create regex to find word boundaries (case-insensitive)
			const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
			let match;
			// Reset regex lastIndex to avoid issues with multiple searches
			regex.lastIndex = 0;
			while ((match = regex.exec(text)) !== null) {
				wordMatches.push({
					word: match[0], // Keep original case
					index: match.index,
					length: match[0].length,
					explanation
				});
			}
		}

		// Sort by index, and filter out overlapping matches (keep first one)
		wordMatches.sort((a, b) => a.index - b.index);
		
		// Filter overlapping matches - if two matches overlap, keep only the first
		const filteredMatches: Array<{ word: string; index: number; length: number; explanation: string }> = [];
		for (const match of wordMatches) {
			const overlaps = filteredMatches.some(existing => {
				const existingEnd = existing.index + existing.length;
				const matchEnd = match.index + match.length;
				// Check if they overlap
				return !(match.index >= existingEnd || matchEnd <= existing.index);
			});
			if (!overlaps) {
				filteredMatches.push(match);
			}
		}

		// Build parts array
		for (const match of filteredMatches) {
			// Add text before the match
			if (match.index > lastIndex) {
				parts.push({
					type: 'text',
					content: text.substring(lastIndex, match.index)
				});
			}

			// Add tooltip for the matched word
			parts.push({
				type: 'tooltip',
				content: match.word,
				word: match.word,
				explanation: match.explanation
			});

			lastIndex = match.index + match.length;
		}

		// Add remaining text
		if (lastIndex < text.length) {
			parts.push({
				type: 'text',
				content: text.substring(lastIndex)
			});
		}

		return parts.length > 0 ? parts : [{ type: 'text', content: text }];
	}

	const textParts = $derived(renderTextWithTooltips());
</script>

{#each textParts as part}
	{#if part.type === 'tooltip' && part.word && part.explanation}
		<ToolTip text={part.explanation}>
			<span class="tooltipped-word">{part.word}</span>
		</ToolTip>
	{:else}
		{part.content}
	{/if}
{/each}

<style>
	:global(.tooltipped-word) {
		color: var(--color-primary);
		text-decoration: underline;
		text-decoration-style: dotted;
		text-underline-offset: 2px;
		cursor: help;
	}
</style>

