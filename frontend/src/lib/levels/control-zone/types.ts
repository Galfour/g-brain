export type TransformType = 'translation' | 'rotation' | 'scaling';

export type Transform =
	| { type: 'translation'; id: string; direction: number; distance: number; minDistance?: number; maxDistance?: number }
	| { type: 'rotation'; id: string; angle: number; centerX: number; centerY: number; minAngle?: number; maxAngle?: number }
	| { type: 'scaling'; id: string; scaleX: number; scaleY: number; minScale?: number; maxScale?: number };

export type Obstacle = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type Button = {
	id: string;
	label: string;
	transformId: string;
	property: string; // e.g., 'direction', 'distance', 'angle', 'scaleX'
	increment: number;
	minValue?: number;
	maxValue?: number;
};

export type ControlZoneConfig = {
	title: string;
	subtitle: string;
	targetZone: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	initialPlayerPos: {
		x: number;
		y: number;
	};
	transforms: Transform[];
	obstacles: Obstacle[];
	buttons: Button[];
	source: 'procgen' | 'fixed'; // Whether level uses procedural generation or is fixed
	requiredCompletions: number; // Number of consecutive successes required to validate the level
	scoreConfig?: {
		primaryScore: string; // Name of the primary score metric (e.g., 'clicks')
		maximize: boolean; // Whether to maximize (true) or minimize (false) the score
	};
};
