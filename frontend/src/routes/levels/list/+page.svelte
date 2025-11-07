<script lang="ts">
	import { root, getAllLevels, type LevelNode } from '$lib/levels';
	import { isLevelValidated } from '$lib/player-data';
	import Card from '$lib/component/Card.svelte';
	import Column from '$lib/component/Column.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import { m } from '$lib/paraglide/messages.js';

	function getLevelCount(node: LevelNode): number {
		if (node.type === 'level') {
			return 1;
		}
		return node.children.reduce((sum, child) => sum + getLevelCount(child), 0);
	}
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>{m.levels_title()}</Title>
		<Subtitle>{m.levels_subtitle()}</Subtitle>
	</Column>

	<div class="grid grid--3">
		{#each root.children as child}
			{@const levelCount = getLevelCount(child)}
			{#if child.type === 'folder'}
				<Card>
					<Column gap="var(--space-3)">
						<div class="title" style="font-size: 20px;">{child.title}</div>
						<div class="subtitle">{levelCount} {levelCount !== 1 ? m.levels_puzzles() : m.levels_puzzle()} {m.levels_available()}</div>
						<a class="btn btn--primary" href={`/levels/list/${child.id}`}>{m.levels_browse()}</a>
					</Column>
				</Card>
			{:else}
				{@const validated = isLevelValidated(child.id)}
				<Card>
					<Column gap="var(--space-3)">
						<div class="title" style="font-size: 18px;">{child.title}</div>
						<div class="subtitle">{child.description}</div>
						<a class="btn btn--primary" href={`/level/play?level=${child.id}`}>{m.levels_play()}</a>
					</Column>
				</Card>
			{/if}
		{/each}
	</div>
</Column>



