<script lang="ts">
	import LessonComponent from '$lib/component/Lesson.svelte';
	import type { LessonConfig } from './types';

	let {
		config,
		oncomplete
	} = $props<{
		config: LessonConfig;
		oncomplete?: (status: 'success' | 'failure') => void;
	}>();

	function createMarkup(content: string) {
		// Return content trimmed, preserving HTML structure
		return content.trim();
	}
</script>

<LessonComponent title={config.title} sectionId={config.sectionId} oncomplete={oncomplete}>
	{@html createMarkup(config.content)}
</LessonComponent>

