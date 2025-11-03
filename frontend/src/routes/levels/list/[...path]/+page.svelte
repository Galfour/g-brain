<script lang="ts">
	import { page } from '$app/stores';
	import { root, findNodeByPath, getAllLevels, type LevelNode } from '$lib/levels';
	import { isLevelValidated } from '$lib/player-data';
	import Card from '$lib/component/Card.svelte';
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import ToolTip from '$lib/component/ToolTip.svelte';

	const pathParam = $page.params.path || '';
	const pathSegments = pathParam.split('/').filter(Boolean);
	
	const currentNode = $derived(findNodeByPath(root, pathSegments));
	
	function getLevelCount(node: LevelNode): number {
		if (node.type === 'level') {
			return 1;
		}
		return node.children.reduce((sum, child) => sum + getLevelCount(child), 0);
	}
	
	function getPathUrl(segments: string[]): string {
		return `/levels/list/${segments.join('/')}`;
	}
	
	const breadcrumbs = $derived.by(() => {
		const crumbs: Array<{ title: string; url: string }> = [
			{ title: 'Root', url: '/levels/list' }
		];
		
		let current: LevelNode = root;
		for (let i = 0; i < pathSegments.length; i++) {
			if (current.type === 'folder') {
				const segment = pathSegments[i];
				const found: LevelNode | undefined = current.children.find(child => child.id === segment);
				if (found) {
					const segmentsUpToHere = pathSegments.slice(0, i + 1);
					crumbs.push({
						title: found.title,
						url: getPathUrl(segmentsUpToHere)
					});
					current = found;
				}
			}
		}
		
		return crumbs;
	});
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>{currentNode?.title || 'Not Found'}</Title>
		<Subtitle>
			{#if currentNode}
				{#if currentNode.type === 'folder'}
					{#if currentNode.children.length === 0}
						This folder is empty
					{:else}
						{getLevelCount(currentNode)} puzzle{getLevelCount(currentNode) !== 1 ? 's' : ''} available
					{/if}
				{:else}
					{currentNode.description}
				{/if}
			{:else}
				Path not found
			{/if}
		</Subtitle>
	</Column>

	{#if pathSegments.length > 0}
		<Row gap="var(--space-2)" style="flex-wrap: wrap; align-items: center;">
			{#each breadcrumbs as crumb, i}
				<a href={crumb.url} style="color: var(--color-muted); text-decoration: none;">
					{crumb.title}
				</a>
				{#if i < breadcrumbs.length - 1}
					<span style="color: var(--color-muted);">/</span>
				{/if}
			{/each}
		</Row>
	{/if}

	{#if currentNode && currentNode.type === 'folder'}
		<div class="grid grid--3">
			{#each currentNode.children as child}
				{#if child.type === 'folder'}
					{@const levelCount = getLevelCount(child)}
					<Card>
						<Column gap="var(--space-3)">
							<div class="title" style="font-size: 20px;">{child.title}</div>
							<div class="subtitle">{levelCount} puzzle{levelCount !== 1 ? 's' : ''} available</div>
							<a class="btn btn--primary" href={getPathUrl([...pathSegments, child.id])}>Browse</a>
						</Column>
					</Card>
				{:else}
					{@const validated = isLevelValidated(child.id)}
					<Card>
						<Column gap="var(--space-3)">
							<Row gap="var(--space-2)" style="align-items: center;">
								<div class="title" style="font-size: 18px;">{child.title}</div>
								{#if child.source === 'procgen'}
									<ToolTip text="Procedurally generated level - requires {child.requiredCompletions} completions in a row to validate">
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
											<path d="M5.5 4.5L2 8L5.5 11.5M10.5 4.5L14 8L10.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
										</svg>
									</ToolTip>
								{:else}
									<ToolTip text="Fixed level - requires {child.requiredCompletions} completions in a row to validate">
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
							<div class="subtitle">{child.description}</div>
							<Row>
								<a class="btn btn--primary" href={`/level/play?level=${child.id}`}>Play</a>
							</Row>
						</Column>
					</Card>
				{/if}
			{/each}
		</div>
	{:else if currentNode && currentNode.type === 'level'}
		<Column gap="var(--space-3)">
			<Subtitle>This is a level. <a href={`/level/play?level=${currentNode.id}`}>Play it here</a>.</Subtitle>
			<a class="btn btn--primary" href="/levels/list">Back to Categories</a>
		</Column>
	{:else}
		<Column gap="var(--space-3)">
			<Subtitle>Path "{pathParam}" not found.</Subtitle>
			<a class="btn btn--primary" href="/levels/list">Back to Categories</a>
		</Column>
	{/if}
</Column>
