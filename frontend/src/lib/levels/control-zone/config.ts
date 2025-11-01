import type { ControlZoneConfig } from './types';

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
			title: 'Control Zone 1: Simple Translation',
			subtitle: 'Use the buttons to move the player to the target zone',
			isProcgen: false,
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
					label: 'Button A',
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: 'Button B',
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				}
			]
		},
		'control-zone-2': {
			title: 'Control Zone 2: Two Directions',
			subtitle: 'Navigate using two button pairs',
			isProcgen: false,
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
					label: 'Button A',
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: 'Button B',
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				},
				{
					id: 'left',
					label: 'Button C',
					transformId: 'horizontal',
					property: 'distance',
					increment: -20
				},
				{
					id: 'right',
					label: 'Button D',
					transformId: 'horizontal',
					property: 'distance',
					increment: 20
				}
			]
		},
		'control-zone-3': {
			title: 'Control Zone 3: Diagonal Movement',
			subtitle: 'Find the diagonal translation pattern',
			isProcgen: true,
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
					label: 'Button A',
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: 'Button B',
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				},
				{
					id: 'diag-forward',
					label: 'Button C',
					transformId: 'diagonal',
					property: 'distance',
					increment: 20
				},
				{
					id: 'diag-back',
					label: 'Button D',
					transformId: 'diagonal',
					property: 'distance',
					increment: -20
				}
			]
		},
		'control-zone-4': {
			title: 'Control Zone 4: Translation and Rotation',
			subtitle: 'Combine translation with rotation around the center',
			isProcgen: false,
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
					label: 'Button A',
					transformId: 'vertical',
					property: 'distance',
					increment: 20
				},
				{
					id: 'down',
					label: 'Button B',
					transformId: 'vertical',
					property: 'distance',
					increment: -20
				},
				{
					id: 'rotate-cw',
					label: 'Button C',
					transformId: 'rotate',
					property: 'angle',
					increment: 15
				},
				{
					id: 'rotate-ccw',
					label: 'Button D',
					transformId: 'rotate',
					property: 'angle',
					increment: -15
				}
			]
		}
	};

	return configs[levelId] || null;
}
