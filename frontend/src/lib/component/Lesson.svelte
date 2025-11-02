<script lang="ts">
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Title from '$lib/component/Title.svelte';
	import Button from '$lib/component/Button.svelte';
	import { goto } from '$app/navigation';

	let {
		title,
		sectionId,
		oncomplete,
		children
	} = $props<{
		title: string;
		sectionId: string;
		oncomplete?: (status: 'success' | 'failure') => void;
		children?: () => any;
	}>();

	function handleComplete() {
		oncomplete?.('success');
	}

	function handleGoBack() {
		goto(`/levels/list/${sectionId}`);
	}
</script>

<Column gap="var(--space-6)">
	<Title>{title}</Title>
	
	<div style="font-size: 16px; line-height: 1.6; color: var(--color-text);">
		{@render children?.()}
	</div>

	<Row gap="var(--space-3)" style="justify-content: flex-start;">
		<Button onclick={handleComplete}>Complete the lesson</Button>
		<Button onclick={handleGoBack} variant="ghost">Go back to the list</Button>
	</Row>
</Column>

