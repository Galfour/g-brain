import type { PlayerData, LevelStart, LevelCompletion, LevelCompletionStatus, BestScore } from './types';
import { levels } from '$lib/levels';
import { getLevelConfig } from '$lib/levels/boolean-gates/config';
import { getLevelConfig as getColorSortingConfig } from '$lib/levels/color-sorting/config';
import { getLevelConfig as getControlZoneConfig } from '$lib/levels/control-zone/config';
import { getLevelConfig as getFormalWordsConfig } from '$lib/levels/formal-words/config';

const CURRENT_PLAYER_KEY = 'g-brain-current-player';
const PLAYER_DATA_PREFIX = 'g-brain-player-data-';

function getStorageKey(playerName: string): string {
	return `${PLAYER_DATA_PREFIX}${playerName}`;
}

function getDefaultPlayerData(playerName: string): PlayerData {
	return {
		userName: playerName,
		levelStarts: [],
		levelCompletions: [],
		bestScores: []
	};
}

function loadPlayerData(playerName: string): PlayerData {
	if (typeof window === 'undefined') {
		return getDefaultPlayerData(playerName);
	}

	try {
		const stored = localStorage.getItem(getStorageKey(playerName));
		if (!stored) {
			return getDefaultPlayerData(playerName);
		}
		const data = JSON.parse(stored);
		// Ensure bestScores exists for backward compatibility
		if (!data.bestScores) {
			data.bestScores = [];
		}
		return data;
	} catch (error) {
		console.error('Failed to load player data:', error);
		return getDefaultPlayerData(playerName);
	}
}

function savePlayerData(playerName: string, data: PlayerData): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		localStorage.setItem(getStorageKey(playerName), JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save player data:', error);
	}
}

function getCurrentPlayerName(): string {
	if (typeof window === 'undefined') {
		return '';
	}
	const current = localStorage.getItem(CURRENT_PLAYER_KEY);
	return current || '';
}

function setCurrentPlayerName(name: string): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(CURRENT_PLAYER_KEY, name);
}

let playerDataCache: { name: string; data: PlayerData } | null = null;

export function getCurrentPlayer(): string {
	return getCurrentPlayerName();
}

export function getPlayerData(playerName?: string): PlayerData {
	const name = playerName || getCurrentPlayerName();
	if (!name) {
		return { userName: '', levelStarts: [], levelCompletions: [], bestScores: [] };
	}
	
	if (playerDataCache && playerDataCache.name === name) {
		return playerDataCache.data;
	}
	
	const data = loadPlayerData(name);
	playerDataCache = { name, data };
	return data;
}

export function savePlayerDataToStorage(): void {
	if (playerDataCache) {
		savePlayerData(playerDataCache.name, playerDataCache.data);
	}
}

export function getAllPlayerNames(): string[] {
	if (typeof window === 'undefined') {
		return [];
	}
	
	const names: string[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(PLAYER_DATA_PREFIX)) {
			const playerName = key.slice(PLAYER_DATA_PREFIX.length);
			if (playerName) {
				names.push(playerName);
			}
		}
	}
	return names.sort();
}

export function createNewPlayer(name?: string): string {
	const playerName = name || generateRandomName();
	const data = getDefaultPlayerData(playerName);
	savePlayerData(playerName, data);
	setCurrentPlayerName(playerName);
	playerDataCache = { name: playerName, data };
	return playerName;
}

export function switchPlayer(playerName: string): void {
	if (!playerName) return;
	const data = loadPlayerData(playerName);
	setCurrentPlayerName(playerName);
	playerDataCache = { name: playerName, data };
}

export function renamePlayer(oldName: string, newName: string): void {
	if (!oldName || !newName || oldName === newName) return;
	
	// Load old data
	const data = loadPlayerData(oldName);
	data.userName = newName;
	
	// Save with new key
	savePlayerData(newName, data);
	
	// Delete old key
	if (typeof window !== 'undefined') {
		localStorage.removeItem(getStorageKey(oldName));
	}
	
	// Update current player if it was the active one
	if (getCurrentPlayerName() === oldName) {
		setCurrentPlayerName(newName);
	}
	
	playerDataCache = { name: newName, data };
}

export function deletePlayer(playerName: string): void {
	if (typeof window === 'undefined') {
		return;
	}
	
	localStorage.removeItem(getStorageKey(playerName));
	
	// If this was the current player, clear current player
	if (getCurrentPlayerName() === playerName) {
		localStorage.removeItem(CURRENT_PLAYER_KEY);
		playerDataCache = null;
	} else if (playerDataCache?.name === playerName) {
		playerDataCache = null;
	}
}

function generateRandomName(): string {
	const adjectives = [
		'Swift', 'Bold', 'Clever', 'Mighty', 'Brave', 'Wise', 'Bright', 'Quick',
		'Sharp', 'Noble', 'Calm', 'Fierce', 'Gentle', 'Steady', 'Silent', 'Swift',
		'Wild', 'Tame', 'Ancient', 'Young', 'Golden', 'Silver', 'Red', 'Blue'
	];
	const nouns = [
		'Wolf', 'Eagle', 'Lion', 'Tiger', 'Bear', 'Fox', 'Hawk', 'Raven',
		'Phoenix', 'Dragon', 'Falcon', 'Panther', 'Jaguar', 'Lynx', 'Owl', 'Stag',
		'Warrior', 'Hunter', 'Scout', 'Guardian', 'Explorer', 'Sage', 'Mage', 'Ranger'
	];
	
	let name: string;
	let attempts = 0;
	
	do {
		const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
		const noun = nouns[Math.floor(Math.random() * nouns.length)];
		name = `${adj} ${noun}`;
		attempts++;
	} while (getAllPlayerNames().includes(name) && attempts < 10);
	
	return name;
}

export function trackLevelStart(levelId: string, playerName?: string): void {
	const name = playerName || getCurrentPlayerName();
	if (!name) return;
	
	const data = getPlayerData(name);
	const startTime = Date.now();
	
	// Prevent duplicate starts within 2 seconds (handles rapid re-renders or duplicate calls)
	const recentStart = data.levelStarts.find(
		start => start.levelId === levelId && Math.abs(startTime - start.startTime) < 2000
	);
	
	// Only add a new start if there isn't a very recent one
	if (!recentStart) {
		data.levelStarts.push({
			levelId,
			startTime
		});
		if (playerDataCache && playerDataCache.name === name) {
			playerDataCache.data = data;
		} else {
			playerDataCache = { name, data };
		}
		savePlayerData(name, data);
	}
}

function getLevelScoreConfig(levelId: string): { primaryScore: string; target: 'maximize' | 'minimize' } | null {
	// Try to get score config from level configs
	if (levelId.startsWith('boolean-gates-')) {
		const config = getLevelConfig(levelId);
		return config?.scoreConfig || null;
	} else if (levelId.startsWith('color-sorting-')) {
		const config = getColorSortingConfig(levelId);
		return config?.scoreConfig || null;
	} else if (levelId.startsWith('control-zone-')) {
		const config = getControlZoneConfig(levelId);
		return config?.scoreConfig || null;
	} else if (levelId.startsWith('formal-words-')) {
		const config = getFormalWordsConfig(levelId);
		return config?.scoreConfig || null;
	}
	return null;
}

export function trackLevelCompletion(levelId: string, status: LevelCompletionStatus, scores?: Record<string, number>, playerName?: string): void {
	const name = playerName || getCurrentPlayerName();
	if (!name) return;
	
	const data = getPlayerData(name);
	const completionTime = Date.now();
	
	// Find the most recent start for this level that hasn't been completed yet
	const start = data.levelStarts
		.filter(s => s.levelId === levelId)
		.sort((a, b) => b.startTime - a.startTime)
		.find(s => {
			// Check if this start already has a completion
			return !data.levelCompletions.some(
				c => c.levelId === levelId && 
				c.completionTime >= s.startTime &&
				c.timeSpent === (c.completionTime - s.startTime)
			);
		});
	
	const timeSpent = start ? completionTime - start.startTime : 0;
	
	const completion: LevelCompletion = {
		levelId,
		status,
		completionTime,
		timeSpent
	};
	
	if (scores) {
		completion.scores = scores;
	}
	
	data.levelCompletions.push(completion);
	
	// Update best score if this is a successful completion with scores
	if (status === 'success' && scores) {
		const scoreConfig = getLevelScoreConfig(levelId);
		if (scoreConfig && scores[scoreConfig.primaryScore] !== undefined) {
			const primaryScoreValue = scores[scoreConfig.primaryScore];
			const existingBest = data.bestScores.find(bs => bs.levelId === levelId);
			
			let shouldUpdate = false;
			if (!existingBest) {
				shouldUpdate = true;
			} else {
				// A "good score" is the lowest (for max score) or highest (for min score) score reached
				// For maximize: good score is highest, so we want to update if new score > best
				// For minimize: good score is lowest, so we want to update if new score < best
				if (scoreConfig.target === 'maximize') {
					shouldUpdate = primaryScoreValue > existingBest.score;
				} else {
					shouldUpdate = primaryScoreValue < existingBest.score;
				}
			}
			
			if (shouldUpdate) {
				if (existingBest) {
					existingBest.score = primaryScoreValue;
					existingBest.achievedAt = completionTime;
				} else {
					data.bestScores.push({
						levelId,
						score: primaryScoreValue,
						achievedAt: completionTime
					});
				}
			}
		}
	}
	
	if (playerDataCache && playerDataCache.name === name) {
		playerDataCache.data = data;
	} else {
		playerDataCache = { name, data };
	}
	savePlayerData(name, data);
}

export function getLevelStarts(levelId?: string, playerName?: string): LevelStart[] {
	const data = getPlayerData(playerName);
	if (levelId) {
		return data.levelStarts.filter(start => start.levelId === levelId);
	}
	return data.levelStarts;
}

export function getLevelCompletions(levelId?: string, playerName?: string): LevelCompletion[] {
	const data = getPlayerData(playerName);
	if (levelId) {
		return data.levelCompletions.filter(completion => completion.levelId === levelId);
	}
	return data.levelCompletions;
}

export function clearPlayerData(playerName?: string): void {
	const name = playerName || getCurrentPlayerName();
	if (!name) return;
	
	const data = getDefaultPlayerData(name);
	savePlayerData(name, data);
	if (playerDataCache && playerDataCache.name === name) {
		playerDataCache.data = data;
	}
}

/**
 * Get the required number of completions for a level.
 * Uses the requiredCompletions property from the level meta.
 */
function getRequiredCompletions(levelId: string): number {
	const level = levels.find(l => l.id === levelId);
	if (!level) {
		// Default to 3 for backward compatibility if level not found
		return 3;
	}
	return level.requiredCompletions;
}

/**
 * Get the validation progress for a level (number of consecutive successes).
 * Returns a number from 0 to the required completions representing how many consecutive successes
 * there are from the most recent completion.
 */
export function getValidationProgress(levelId: string, playerName?: string): number {
	const name = playerName || getCurrentPlayerName();
	if (!name) return 0;
	
	const data = getPlayerData(name);
	const requiredCompletions = getRequiredCompletions(levelId);
	
	// Get all completions for this level, sorted by completion time (most recent first)
	const levelCompletions = data.levelCompletions
		.filter(c => c.levelId === levelId)
		.sort((a, b) => b.completionTime - a.completionTime);
	
	if (levelCompletions.length === 0) {
		return 0;
	}
	
	// Count consecutive successes from the most recent
	let count = 0;
	for (const completion of levelCompletions) {
		if (completion.status === 'success') {
			count++;
			if (count >= requiredCompletions) break; // No need to count beyond required
		} else {
			break; // Failure breaks the streak
		}
	}
	
	return count;
}

/**
 * Get the required number of completions for a level.
 */
export function getRequiredCompletionsForLevel(levelId: string): number {
	return getRequiredCompletions(levelId);
}

/**
 * Check if a level is validated (succeeded required number of times in a row).
 */
export function isLevelValidated(levelId: string, playerName?: string): boolean {
	const requiredCompletions = getRequiredCompletions(levelId);
	return getValidationProgress(levelId, playerName) >= requiredCompletions;
}

/**
 * Get the best score for a level.
 */
export function getBestScore(levelId: string, playerName?: string): BestScore | null {
	const name = playerName || getCurrentPlayerName();
	if (!name) return null;
	
	const data = getPlayerData(name);
	const best = data.bestScores.find(bs => bs.levelId === levelId);
	return best || null;
}

