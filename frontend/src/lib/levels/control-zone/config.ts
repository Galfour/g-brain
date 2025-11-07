import type { ControlZoneConfig } from './types';
import { m } from '$lib/paraglide/messages.js';

function getLevelTitle(levelId: string): string {
	const levelNum = levelId.split('-').pop();
	return (m[`level_control_zone_${levelNum}_title` as keyof typeof m] as (inputs?: any) => string)({}) as string;
}

function getLevelSubtitle(levelId: string): string {
	const levelNum = levelId.split('-').pop();
	return (m[`level_control_zone_${levelNum}_subtitle` as keyof typeof m] as (inputs?: any) => string)({}) as string;
}

function getButtonLabel(buttonId: string): string {
	const buttonMap: Record<string, keyof typeof m> = {
		'up': 'button_a',
		'down': 'button_b',
		'left': 'button_c',
		'right': 'button_d',
		'diag-forward': 'button_c',
		'diag-back': 'button_d',
		'rotate-cw': 'button_c',
		'rotate-ccw': 'button_d'
	};
	const key = buttonMap[buttonId] || 'button_a';
	return (m[key] as (inputs?: any) => string)({}) as string;
}

// Generate random diagonal direction that's not too close to horizontal
function generateRandomDiagonalDirection(): number {
	let direction: number;
	let attempts = 0;
	const maxAttempts = 100;
	const threshold = 20; // degrees away from horizontal
	
	do {
		direction = Math.random() * 360; // Random direction in degrees
		const normalizedDir = direction % 360;
		// Check distance from both 0° (horizontal right) and 180° (horizontal left)
		const distFrom0 = Math.min(normalizedDir, 360 - normalizedDir);
		const distFrom180 = Math.abs(normalizedDir - 180);
		const minDist = Math.min(distFrom0, distFrom180);
		
		if (minDist >= threshold) {
			return direction;
		}
		attempts++;
	} while (attempts < maxAttempts);
	
	// Fallback to a safe diagonal direction if we can't find one
	return 45;
}

export function getLevelConfig(levelId: string): ControlZoneConfig | null {
	const configs: Record<string, ControlZoneConfig> = {
		'control-zone-1': {
			title: getLevelTitle('control-zone-1'),
			subtitle: getLevelSubtitle('control-zone-1'),
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'clicks',
				target: 'minimize'
			},
			targetZone: {
				x: 300,
				y: 150, // Up from start position
				width: 40,
				height: 40
			},
			initialPlayerPos: {
				x: 300,
				y: 300
			},
			transforms: [
				{
					type: 'translation',
					id: 'vertical',
					direction: 270, // up (negative y in screen coords)
					distance: 0
				}
			],
			obstacles: [],
			buttons: [
				{
					id: 'up',
					label: getButtonLabel('up'),
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: getButtonLabel('down'),
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				}
			]
		},
		'control-zone-2': {
			title: getLevelTitle('control-zone-2'),
			subtitle: getLevelSubtitle('control-zone-2'),
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'clicks',
				target: 'minimize'
			},
			targetZone: {
				x: 450,
				y: 150,
				width: 40,
				height: 40
			},
			initialPlayerPos: {
				x: 300,
				y: 300
			},
			transforms: [
				{
					type: 'translation',
					id: 'vertical',
					direction: 270, // up
					distance: 0
				},
				{
					type: 'translation',
					id: 'horizontal',
					direction: 0, // right
					distance: 0
				}
			],
			obstacles: [],
			buttons: [
				{
					id: 'up',
					label: getButtonLabel('up'),
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: getButtonLabel('down'),
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				},
				{
					id: 'left',
					label: getButtonLabel('left'),
					transformId: 'horizontal',
					property: 'distance',
					increment: -20
				},
				{
					id: 'right',
					label: getButtonLabel('right'),
					transformId: 'horizontal',
					property: 'distance',
					increment: 20
				}
			]
		},
		'control-zone-3': {
			title: getLevelTitle('control-zone-3'),
			subtitle: getLevelSubtitle('control-zone-3'),
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'clicks',
				target: 'minimize'
			},
			targetZone: {
				x: 450,
				y: 450,
				width: 40,
				height: 40
			},
			initialPlayerPos: {
				x: 150,
				y: 150
			},
			transforms: [
				{
					type: 'translation',
					id: 'vertical',
					direction: 270, // up
					distance: 0
				},
				{
					type: 'translation',
					id: 'diagonal',
					direction: generateRandomDiagonalDirection(), // random diagonal direction
					distance: 0
				}
			],
			obstacles: [],
			buttons: [
				{
					id: 'up',
					label: getButtonLabel('up'),
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: getButtonLabel('down'),
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				},
				{
					id: 'diag-forward',
					label: getButtonLabel('diag-forward'),
					transformId: 'diagonal',
					property: 'distance',
					increment: 20
				},
				{
					id: 'diag-back',
					label: getButtonLabel('diag-back'),
					transformId: 'diagonal',
					property: 'distance',
					increment: -20
				}
			]
		},
		'control-zone-4': {
			title: getLevelTitle('control-zone-4'),
			subtitle: getLevelSubtitle('control-zone-4'),
			source: 'fixed',
			requiredCompletions: 2,
			scoreConfig: {
				primaryScore: 'clicks',
				target: 'minimize'
			},
			targetZone: {
				x: 450,
				y: 150,
				width: 40,
				height: 40
			},
			initialPlayerPos: {
				x: 300,
				y: 300
			},
			transforms: [
				{
					type: 'translation',
					id: 'vertical',
					direction: 270, // up
					distance: 0
				},
				{
					type: 'rotation',
					id: 'rotate',
					angle: 0,
					centerX: 300,
					centerY: 300,
					minAngle: -360,
					maxAngle: 360
				}
			],
			obstacles: [],
			buttons: [
				{
					id: 'up',
					label: getButtonLabel('up'),
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: getButtonLabel('down'),
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				},
				{
					id: 'rotate-cw',
					label: getButtonLabel('rotate-cw'),
					transformId: 'rotate',
					property: 'angle',
					increment: 15
				},
				{
					id: 'rotate-ccw',
					label: getButtonLabel('rotate-ccw'),
					transformId: 'rotate',
					property: 'angle',
					increment: -15
				}
			]
		}
	};

	return configs[levelId] || null;
}
