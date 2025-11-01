export type AnswerType = 'text' | 'binary' | 'multiple-choice';

export type FormalWordsConfig = {
	levelType: 'real-concatenate' | 'formal-concatenate' | 'real-reverse' | 'formal-reverse' | 'palindrome-check' | 'isPrefix' | 'isSuffix' | 'isSubstring';
	answerType: AnswerType;
	title: string;
	subtitle: string;
	isProcgen: boolean;
	// For level generation
	generateQuestion: () => {
		prompt: string;
		example: string; // Example showing the pattern
		correctAnswer: string;
		options?: string[] | [string, string]; // For multiple-choice or binary
	};
};

