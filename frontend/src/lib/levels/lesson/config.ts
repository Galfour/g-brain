import type { LessonConfig } from './types';

const lessons: Record<string, LessonConfig> = {
	'lesson-boolean-gates': {
		title: 'Introduction to Boolean Gates',
		content: `
			<p>Welcome to Boolean Gates! This section will teach you the fundamentals of boolean logic through interactive puzzles.</p>
			<p>Boolean gates are the building blocks of digital circuits. You'll learn about AND, OR, NOT, and other logical operations.</p>
			<p>Each puzzle will present you with inputs and gates, and your task is to connect them correctly to achieve the desired output.</p>
			<p>Take your time to understand each concept before moving on to the exercises.</p>
		`,
		sectionId: 'boolean-gates'
	},
	'lesson-color-sorting': {
		title: 'Introduction to Color Sorting',
		content: `
			<p>Welcome to Color Sorting! This section challenges you to organize colors based on different properties.</p>
			<p>You'll learn to sort colors by various attributes like brightness, hue, saturation, and more.</p>
			<p>Each level will present you with a set of colors that need to be arranged in a specific order.</p>
			<p>Pay attention to the subtle differences between colors and use your visual skills to complete each challenge.</p>
		`,
		sectionId: 'color-sorting'
	},
	'lesson-control-zone': {
		title: 'Introduction to Control Zone',
		content: `
			<p>Welcome to Control Zone! This section focuses on spatial reasoning and precise movement.</p>
			<p>You'll learn to navigate objects to target zones while avoiding obstacles and following specific rules.</p>
			<p>Each puzzle requires careful planning and precise control to move objects to their designated areas.</p>
			<p>Think ahead and plan your movements carefully to succeed in each challenge.</p>
		`,
		sectionId: 'control-zone'
	},
	'lesson-formal-words': {
		title: 'Introduction to Formal Words',
		content: `
			<p>Welcome to Formal Words! This section explores formal language theory and string manipulation.</p>
			<p>You'll learn about formal languages, patterns, and string operations like concatenation, prefixes, and suffixes.</p>
			<p>Each puzzle will test your understanding of how strings can be constructed and manipulated according to formal rules.</p>
			<p>Focus on the patterns and rules presented in each exercise to solve the challenges.</p>
		`,
		sectionId: 'formal-words'
	}
};

export function getLessonConfig(lessonId: string): LessonConfig | null {
	return lessons[lessonId] || null;
}

