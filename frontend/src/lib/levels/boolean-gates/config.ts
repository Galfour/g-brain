import type { BooleanGatesConfig } from './types';
import { colors } from './types';

export function getLevelConfig(levelId: string): BooleanGatesConfig | null {
	const configs: Record<string, BooleanGatesConfig> = {
		'boolean-gates-1': {
			maxLevers: 6,
			maxActiveLevers: 3,
			activeLeverIndices: [0, 1, 2, 3, 4, 5], // All 6 levers are active
			numOutputs: 2,
			// Output 1 = OR(1, 2, 3), Output 2 = OR(4, 5, 6)
			inputColors: [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]], // All inputs for output 1 are blue, all for output 2 are green
			outputColors: [colors[0], colors[1]], // Output 1 blue, output 2 green
			title: 'Boolean Gates 1',
			subtitle: 'Figure out how the levers control the outputs',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f] = inputs;
				return [a || b || c, d || e || f];
			}
		},
		'boolean-gates-2': {
			maxLevers: 8,
			maxActiveLevers: 4,
			activeLeverIndices: [0, 1, 3, 4, 5, 7], // Levers 1,2,4,5,6,8 are active (dummy at 3,7)
			numOutputs: 3,
			// Output 1 = OR(1, 2), Output 2 = OR(4, 5), Output 3 = OR(6, 8)
			inputColors: [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2]], // Output 1 blue, output 2 green, output 3 orange
			title: 'Boolean Gates 2',
			subtitle: 'Explore the relationships between levers and outputs',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f] = inputs;
				return [a || b, c || d, e || f];
			}
		},
		'boolean-gates-3': {
			maxLevers: 9,
			maxActiveLevers: 4,
			activeLeverIndices: [0, 2, 3, 4, 6, 7], // Levers 1,3,4,5,7,8 are active (dummy at 2,5,6,9)
			numOutputs: 3,
			// Output 1 = AND(1, 3), Output 2 = AND(4, 5), Output 3 = AND(7, 8)
			inputColors: [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2]], // Output 1 blue, output 2 green, output 3 orange
			title: 'Boolean Gates 3',
			subtitle: 'Discover what makes the outputs activate',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f] = inputs;
				return [a && b, c && d, e && f];
			}
		},
		'boolean-gates-4': {
			maxLevers: 8,
			maxActiveLevers: 4,
			activeLeverIndices: [0, 1, 2, 4, 5, 6], // Levers 1,2,3,5,6,7 are active (dummy at 4,8)
			numOutputs: 2,
			// Output 1 = OR(1, 2, 3), Output 2 = AND(5, 6, 7)
			// Lever 5 (index 4 in active inputs, which is lever at position 4) is active but not used - give it a different color
			inputColors: [colors[0], colors[0], colors[0], colors[3], colors[1], colors[1], colors[1]], // Output 1 inputs are blue, output 2 inputs are green, unused lever gets purple
			outputColors: [colors[0], colors[1]], // Output 1 blue, output 2 green
			title: 'Boolean Gates 4',
			subtitle: 'Some levers may not affect the outputs at all',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f] = inputs;
				return [a || b || c, d && e && f];
			}
		},
		'boolean-gates-5': {
			maxLevers: 10,
			maxActiveLevers: 5,
			activeLeverIndices: [0, 1, 2, 4, 5, 6, 7, 9], // Levers 1,2,3,5,6,7,8,10 are active (dummy at 4,9)
			numOutputs: 3,
			// Output 1 = OR(1, 2, 3), Output 2 = OR(5, 6, 7), Output 3 = OR(8, 10)
			inputColors: [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1], colors[2], colors[2]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2]], // Output 1 blue, output 2 green, output 3 orange
			title: 'Boolean Gates 5',
			subtitle: 'Experiment with different lever combinations',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f, g, h] = inputs;
				return [a || b || c, d || e || f, g || h];
			}
		},
		'boolean-gates-6': {
			maxLevers: 10,
			maxActiveLevers: 5,
			activeLeverIndices: [0, 1, 3, 4, 5, 7, 8, 9], // Levers 1,2,4,5,6,8,9,10 are active (dummy at 3,7)
			numOutputs: 4,
			// Output 1 = OR(1, 2), Output 2 = OR(4, 5), Output 3 = OR(6, 8), Output 4 = OR(9, 10)
			inputColors: [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2], colors[3], colors[3]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2], colors[3]], // Each output matches its inputs
			title: 'Boolean Gates 6',
			subtitle: 'Watch how lever states change the outputs',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f, g, h] = inputs;
				return [a || b, c || d, e || f, g || h];
			}
		},
		'boolean-gates-7': {
			maxLevers: 12,
			maxActiveLevers: 6,
			activeLeverIndices: [0, 1, 2, 3, 5, 6, 8, 9, 10], // Levers 1,2,3,4,6,7,9,10,11 are active (dummy at 5,8,12)
			numOutputs: 3,
			// Output 1 = OR(1, 2, 3, 4), Output 2 = OR(6, 7), Output 3 = OR(9, 10, 11)
			inputColors: [colors[0], colors[0], colors[0], colors[0], colors[1], colors[1], colors[2], colors[2], colors[2]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2]], // Each output matches its inputs
			title: 'Boolean Gates 7',
			subtitle: 'Patterns are becoming more complex',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f, g, h, i] = inputs;
				return [a || b || c || d, e || f, g || h || i];
			}
		},
		'boolean-gates-8': {
			maxLevers: 12,
			maxActiveLevers: 6,
			activeLeverIndices: [0, 1, 3, 4, 5, 6, 8, 9, 10, 11], // Levers 1,2,4,5,6,7,9,10,11,12 are active (dummy at 3,8)
			numOutputs: 4,
			// Output 1 = OR(1, 2), Output 2 = AND(4, 5, 6), Output 3 = OR(7, 9), Output 4 = AND(10, 11, 12)
			inputColors: [colors[0], colors[0], colors[1], colors[1], colors[1], colors[2], colors[2], colors[3], colors[3], colors[3]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2], colors[3]], // Each output matches its inputs
			title: 'Boolean Gates 8',
			subtitle: 'The logic may vary between different outputs',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f, g, h, i, j] = inputs;
				return [a || b, c && d && e, f || g, h && i && j];
			}
		},
		'boolean-gates-9': {
			maxLevers: 15,
			maxActiveLevers: 7,
			activeLeverIndices: [0, 1, 2, 4, 5, 6, 8, 9, 10, 11, 13, 14], // Levers 1,2,3,5,6,7,9,10,11,12,14,15 are active (dummy at 4,8,13)
			numOutputs: 4,
			// Output 1 = OR(1, 2, 3), Output 2 = AND(5, 6, 7), Output 3 = XOR(9, 10), Output 4 = OR(11, 12, 14, 15)
			inputColors: [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1], colors[2], colors[2], colors[3], colors[3], colors[3], colors[3]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2], colors[3]], // Each output matches its inputs
			title: 'Boolean Gates 9',
			subtitle: 'Not all levers are connected - find which ones matter',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f, g, h, i, j, k, l] = inputs;
				return [
					a || b || c,
					d && e && f,
					Boolean(g) !== Boolean(h),
					i || j || k || l
				];
			}
		},
		'boolean-gates-10': {
			maxLevers: 16,
			maxActiveLevers: 8,
			activeLeverIndices: [0, 1, 2, 4, 5, 7, 8, 9, 10, 12, 13, 14], // Levers 1,2,3,5,6,8,9,10,11,13,14,15 are active (dummy at 4,7,12,16)
			numOutputs: 5,
			// Output 1 = OR(1, 2, 3), Output 2 = AND(5, 6), Output 3 = XOR(8, 9), Output 4 = NAND(10, 11), Output 5 = OR(13, 14, 15)
			inputColors: [colors[0], colors[0], colors[0], colors[1], colors[1], colors[2], colors[2], colors[3], colors[3], colors[4], colors[4], colors[4]], // Matching colors for each output group
			outputColors: [colors[0], colors[1], colors[2], colors[3], colors[4]], // Each output matches its inputs
			title: 'Boolean Gates 10',
			subtitle: 'Master the most challenging configuration',
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'toggles',
				target: 'minimize'
			},
			booleanFunction: (inputs) => {
				const [a, b, c, d, e, f, g, h, i, j, k, l] = inputs;
				return [
					a || b || c,
					d && e,
					Boolean(f) !== Boolean(g),
					!(h && i),
					j || k || l
				];
			}
		}
	};

	return configs[levelId] || null;
}
