<script lang="ts">
	import { sections } from '$lib/levels';
	import Card from '$lib/component/Card.svelte';
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';

	const booleanGatesSection = sections.find(s => s.id === 'boolean-gates');
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>{booleanGatesSection?.title || 'Boolean Gates'}</Title>
		<Subtitle>Pick a boolean gates puzzle to start</Subtitle>
	</Column>

	{#if booleanGatesSection}
		<div class="grid grid--3">
			{#each booleanGatesSection.levels as level}
				<Card>
					<Column gap="var(--space-3)">
						<div class="title" style="font-size: 18px;">{level.title}</div>
						<div class="subtitle">{level.description}</div>
						<Row>
							<a class="btn btn--primary" href={`/level/play?level=${level.id}`}>Play</a>
						</Row>
					</Column>
				</Card>
			{/each}
		</div>
	{/if}
</Column>
