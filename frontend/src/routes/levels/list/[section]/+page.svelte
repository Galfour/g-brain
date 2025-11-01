<script lang="ts">
	import { page } from '$app/stores';
	import { sections } from '$lib/levels';
	import Card from '$lib/component/Card.svelte';
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
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
							{#if validated}
								<span style="color: var(--color-primary); font-size: 20px;" title="Validated - completed 3 times in a row">✓</span>
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
