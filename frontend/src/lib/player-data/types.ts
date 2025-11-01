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
};

export type PlayerData = {
	userName: string;
	levelStarts: LevelStart[];
	levelCompletions: LevelCompletion[];
};

