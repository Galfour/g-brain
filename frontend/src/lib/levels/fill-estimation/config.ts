import type { FillEstimationConfig, FillShape } from './types';
import { m } from '$lib/paraglide/messages.js';

function generateRandomFillPercentage(): number {
	// Generate between 5% and 95% to avoid edge cases
	return Math.floor(Math.random() * 91) + 5;
}

function generateMultipleChoiceOptions(correctAnswer: number, numOptions: number): number[] {
	const options = new Set<number>([correctAnswer]);
	
	// Generate distractor options that are clearly different
	while (options.size < numOptions) {
		let candidate: number;
		// Ensure options are at least 15% away from existing options
		do {
			candidate = Math.floor(Math.random() * 101);
		} while (
			Array.from(options).some(existing => Math.abs(candidate - existing) < 15)
		);
		options.add(candidate);
	}
	
	return Array.from(options).sort((a, b) => a - b);
}

export function getLevelConfig(levelId: string): FillEstimationConfig | null {
	const configs: Record<string, FillEstimationConfig> = {
		'fill-estimation-1': {
			shape: 'gauge',
			difficulty: 'easy',
			title: m.level_fill_estimation_1_title(),
			subtitle: m.level_fill_estimation_1_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 4, // 4 multiple choice options
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-2': {
			shape: 'square',
			difficulty: 'easy',
			title: m.level_fill_estimation_2_title(),
			subtitle: m.level_fill_estimation_2_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 4,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-3': {
			shape: 'disk-ring',
			difficulty: 'easy',
			title: m.level_fill_estimation_3_title(),
			subtitle: m.level_fill_estimation_3_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 4,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-4': {
			shape: 'gauge',
			difficulty: 'medium',
			title: m.level_fill_estimation_4_title(),
			subtitle: m.level_fill_estimation_4_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 10, // 10% tolerance
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-5': {
			shape: 'square',
			difficulty: 'medium',
			title: m.level_fill_estimation_5_title(),
			subtitle: m.level_fill_estimation_5_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 10,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-6': {
			shape: 'disk-filled',
			difficulty: 'medium',
			title: m.level_fill_estimation_6_title(),
			subtitle: m.level_fill_estimation_6_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 10,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-7': {
			shape: 'gauge',
			difficulty: 'hard',
			title: m.level_fill_estimation_7_title(),
			subtitle: m.level_fill_estimation_7_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 5, // 5% tolerance
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-8': {
			shape: 'square',
			difficulty: 'hard',
			title: m.level_fill_estimation_8_title(),
			subtitle: m.level_fill_estimation_8_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 5,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-9': {
			shape: 'disk-ring',
			difficulty: 'hard',
			title: m.level_fill_estimation_9_title(),
			subtitle: m.level_fill_estimation_9_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 5,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-10': {
			shape: 'gauge',
			difficulty: 'expert',
			title: m.level_fill_estimation_10_title(),
			subtitle: m.level_fill_estimation_10_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 1, // 1% tolerance
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-11': {
			shape: 'square',
			difficulty: 'expert',
			title: m.level_fill_estimation_11_title(),
			subtitle: m.level_fill_estimation_11_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 1,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-12': {
			shape: 'disk-filled',
			difficulty: 'expert',
			title: m.level_fill_estimation_12_title(),
			subtitle: m.level_fill_estimation_12_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 1,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-13': {
			shape: 'disk-filled',
			difficulty: 'easy',
			title: m.level_fill_estimation_13_title(),
			subtitle: m.level_fill_estimation_13_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 4,
			generateFillPercentage: generateRandomFillPercentage
		},
		'fill-estimation-14': {
			shape: 'disk-filled',
			difficulty: 'hard',
			title: m.level_fill_estimation_14_title(),
			subtitle: m.level_fill_estimation_14_subtitle(),
			source: 'procgen',
			requiredCompletions: 5,
			tolerance: 5,
			generateFillPercentage: generateRandomFillPercentage
		}
	};

	return configs[levelId] || null;
}

// Export helper function for generating multiple choice options
export { generateMultipleChoiceOptions };

