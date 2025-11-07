export type LevelCompletionStatus = 'success' | 'failure';

export type LevelStart = {
	levelId: string;
	startTime: number; // timestamp in milliseconds
};

export type LevelCompletion = {
	levelId: string;
	status: LevelCompletionStatus;
	completionTime: number; // timestamp in milliseconds
	timeSpent: number; // time in milliseconds from start to completion
	scores?: Record<string, number>; // Optional scores for this completion
};

export type BestScore = {
	levelId: string;
	score: number;
	achievedAt: number; // timestamp in milliseconds
};

export type PlayerData = {
	userName: string;
	levelStarts: LevelStart[];
	levelCompletions: LevelCompletion[];
	bestScores: BestScore[]; // Best scores per level
};

