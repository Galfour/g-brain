import type { LessonConfig } from './types';
import { m } from '$lib/paraglide/messages.js';

function getLessons(): Record<string, LessonConfig> {
	return {
		'lesson-boolean-gates': {
			title: m.lesson_boolean_gates_title(),
			content: m.lesson_boolean_gates_content(),
			sectionId: 'boolean-gates'
		},
		'lesson-color-sorting': {
			title: m.lesson_color_sorting_title(),
			content: m.lesson_color_sorting_content(),
			sectionId: 'color-sorting'
		},
		'lesson-control-zone': {
			title: m.lesson_control_zone_title(),
			content: m.lesson_control_zone_content(),
			sectionId: 'control-zone'
		},
		'lesson-formal-words': {
			title: m.lesson_formal_words_title(),
			content: m.lesson_formal_words_content(),
			sectionId: 'formal-words'
		}
	};
}

export function getLessonConfig(lessonId: string): LessonConfig | null {
	const lessons = getLessons();
	return lessons[lessonId] || null;
}


