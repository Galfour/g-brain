export type AnswerType = 'text' | 'binary' | 'multiple-choice';

export type FormalWordsConfig = {
	levelType: 'real-concatenate' | 'formal-concatenate' | 'real-reverse' | 'formal-reverse' | 'palindrome-check' | 'isPrefix' | 'isSuffix' | 'isSubstring';
	answerType: AnswerType;
	title: string;
	subtitle: string;
	source: 'procgen' | 'fixed'; // Whether level uses procedural generation or is fixed
	requiredCompletions: number; // Number of consecutive successes required to validate the level
	wordExplanations?: Record<string, string>; // Simple explanations for new words introduced in this level
	scoreConfig?: {
		primaryScore: string; // Name of the primary score metric (e.g., 'attempts')
		target: 'maximize' | 'minimize'; // Whether to maximize or minimize the score
	};
	// For level generation
	generateQuestion: () => {
		prompt: string;
		example: string; // Example showing the pattern
		correctAnswer: string;
		options?: string[] | [string, string]; // For multiple-choice or binary
	};
};

