<script lang="ts">
	import { page } from '$app/stores';
	import { sections } from '$lib/levels';
	import Card from '$lib/component/Card.svelte';
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import ToolTip from '$lib/component/ToolTip.svelte';
	import { isLevelValidated } from '$lib/player-data';

	const sectionId = $page.params.section;
	const section = sections.find(s => s.id === sectionId);
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>{section?.title || 'Levels'}</Title>
		<Subtitle>{section ? `Pick a ${section.title.toLowerCase()} puzzle to start` : 'Section not found'}</Subtitle>
	</Column>

	{#if section}
		<div class="grid grid--3">
			{#each section.levels as level}
				{@const validated = isLevelValidated(level.id)}
				<Card>
					<Column gap="var(--space-3)">
						<Row gap="var(--space-2)" style="align-items: center;">
							<div class="title" style="font-size: 18px;">{level.title}</div>
							{#if level.isProcgen}
								<ToolTip text="Procedurally generated level - requires 5 completions in a row to validate">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
										<path d="M5.5 4.5L2 8L5.5 11.5M10.5 4.5L14 8L10.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
										<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
									</svg>
								</ToolTip>
							{:else}
								<ToolTip text="Fixed level - requires 2 completions in a row to validate">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
										<rect x="3" y="6" width="10" height="6" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
										<path d="M6 6V4C6 3.44772 6.44772 3 7 3H9C9.55228 3 10 3.44772 10 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
									</svg>
								</ToolTip>
							{/if}
							{#if validated}
								<ToolTip text="Validated - completed required number of times in a row">
									<span style="color: var(--color-primary); font-size: 20px;">✓</span>
								</ToolTip>
							{/if}
						</Row>
						<div class="subtitle">{level.description}</div>
						<Row>
							<a class="btn btn--primary" href={`/level/play?level=${level.id}`}>Play</a>
						</Row>
					</Column>
				</Card>
			{/each}
		</div>
	{:else}
		<Column gap="var(--space-3)">
			<Subtitle>Section "{sectionId}" not found.</Subtitle>
			<a class="btn btn--primary" href="/levels/list">Back to Categories</a>
		</Column>
	{/if}
</Column>
