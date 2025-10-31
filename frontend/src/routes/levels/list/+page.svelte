<script lang="ts">
	import { sections } from '$lib/levels';
	import Card from '$lib/component/Card.svelte';
	import Column from '$lib/component/Column.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>Levels</Title>
		<Subtitle>Choose a category to browse puzzles</Subtitle>
	</Column>

	<div class="grid grid--3">
		{#each sections as section}
			<Card>
				<Column gap="var(--space-3)">
					<div class="title" style="font-size: 20px;">{section.title}</div>
					<div class="subtitle">{section.levels.length} puzzle{section.levels.length !== 1 ? 's' : ''} available</div>
					<a class="btn btn--primary" href={`/levels/list/${section.id}`}>Browse</a>
				</Column>
			</Card>
		{/each}
	</div>
</Column>



