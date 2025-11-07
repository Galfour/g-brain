export type BooleanFunction = (inputs: boolean[]) => boolean[];

// Color palette for inputs and outputs
export const colors = [
	'#6aa9ff', // primary blue
	'#6affaa', // green
	'#ffaa6a', // orange
	'#aa6aff', // purple
	'#ff6aa9', // pink
	'#aaff6a', // lime
	'#ffaa9f', // coral
	'#9f6aff', // violet
	'#6affff', // cyan
	'#ffff6a', // yellow
	'#ff6aff', // magenta
	'#ff9f6a', // peach
] as const;

export type BooleanGatesConfig = {
	maxLevers: number;
	maxActiveLevers: number;
	activeLeverIndices: number[]; // Indices (0-based) of levers that are connected to the function
	numOutputs: number;
	booleanFunction: BooleanFunction;
	inputColors: string[]; // Color for each active input (by active input index)
	outputColors: string[]; // Color for each output
	title: string;
	subtitle: string;
	source: 'procgen' | 'fixed'; // Whether level uses procedural generation or is fixed
	requiredCompletions: number; // Number of consecutive successes required to validate the level
	scoreConfig?: {
		primaryScore: string; // Name of the primary score metric (e.g., 'toggles')
		maximize: boolean; // Whether to maximize (true) or minimize (false) the score
	};
};
