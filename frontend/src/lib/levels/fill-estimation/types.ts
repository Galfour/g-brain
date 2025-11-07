export type FillShape = 'gauge' | 'square' | 'disk-ring' | 'disk-filled';

export type FillEstimationConfig = {
	shape: FillShape;
	difficulty: 'easy' | 'medium' | 'hard' | 'expert';
	title: string;
	subtitle: string;
	source: 'procgen' | 'fixed';
	requiredCompletions: number;
	// For easy: number of multiple choice options
	// For medium/hard/expert: tolerance percentage (10, 5, or 1)
	tolerance: number;
	// Function to generate a random fill percentage
	generateFillPercentage: () => number;
};

