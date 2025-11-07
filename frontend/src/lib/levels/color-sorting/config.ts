import type { ColorSortingConfig, RGB } from './types';

// Helper to generate colors that vary only in one property (for easy levels)
function generateColorsByRedness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	const step = Math.floor(255 / (numColors - 1));
	const g = Math.floor(Math.random() * 256); // Random green
	const b = Math.floor(Math.random() * 256); // Random blue
	for (let i = 0; i < numColors; i++) {
		const r = Math.min(i * step, 255);
		colors.push({ r, g, b });
	}
	return colors.sort(() => Math.random() - 0.5); // Shuffle
}

function generateColorsByGreenness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	const step = Math.floor(255 / (numColors - 1));
	const r = Math.floor(Math.random() * 256); // Random red
	const b = Math.floor(Math.random() * 256); // Random blue
	for (let i = 0; i < numColors; i++) {
		const g = Math.min(i * step, 255);
		colors.push({ r, g, b });
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateColorsByBlueness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	const step = Math.floor(255 / (numColors - 1));
	const r = Math.floor(Math.random() * 256); // Random red
	const g = Math.floor(Math.random() * 256); // Random green
	for (let i = 0; i < numColors; i++) {
		const b = Math.min(i * step, 255);
		colors.push({ r, g, b });
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateColorsByHue(numColors: number): RGB[] {
	const colors: RGB[] = [];
	const step = 360 / numColors;
	const s = 50 + Math.floor(Math.random() * 40); // Random saturation between 50-90
	const v = 50 + Math.floor(Math.random() * 40); // Random brightness between 50-90
	for (let i = 0; i < numColors; i++) {
		const h = (i * step) % 360;
		const color = hsvToRgb(h, s, v);
		colors.push(color);
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateColorsBySaturation(numColors: number): RGB[] {
	const colors: RGB[] = [];
	const step = 100 / (numColors - 1);
	const h = Math.floor(Math.random() * 360); // Random hue
	const v = 50 + Math.floor(Math.random() * 40); // Random brightness between 50-90
	for (let i = 0; i < numColors; i++) {
		const s = Math.min(i * step, 100);
		const color = hsvToRgb(h, s, v);
		colors.push(color);
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateColorsByBrightness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	const step = 100 / (numColors - 1);
	const h = Math.floor(Math.random() * 360); // Random hue
	const s = 50 + Math.floor(Math.random() * 40); // Random saturation between 50-90
	for (let i = 0; i < numColors; i++) {
		const v = Math.min(i * step, 100);
		const color = hsvToRgb(h, s, v);
		colors.push(color);
	}
	return colors.sort(() => Math.random() - 0.5);
}

// Helper to convert HSV to RGB
function hsvToRgb(h: number, s: number, v: number): RGB {
	s /= 100;
	v /= 100;
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;

	let r = 0, g = 0, b = 0;

	if (h >= 0 && h < 60) {
		r = c; g = x; b = 0;
	} else if (h >= 60 && h < 120) {
		r = x; g = c; b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0; g = c; b = x;
	} else if (h >= 180 && h < 240) {
		r = 0; g = x; b = c;
	} else if (h >= 240 && h < 300) {
		r = x; g = 0; b = c;
	} else if (h >= 300 && h < 360) {
		r = c; g = 0; b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return { r, g, b };
}

// Medium/hard levels - colors vary in multiple properties but sorted by one
function generateRandomColors(numColors: number): RGB[] {
	const colors: RGB[] = [];
	const seen = new Set<string>();
	while (colors.length < numColors) {
		const r = Math.floor(Math.random() * 256);
		const g = Math.floor(Math.random() * 256);
		const b = Math.floor(Math.random() * 256);
		const key = `${r},${g},${b}`;
		if (!seen.has(key)) {
			seen.add(key);
			colors.push({ r, g, b });
		}
	}
	return colors;
}

// Helper to generate non-equidistant values covering the full range
function generateNonEquidistantValues(numValues: number, min: number, max: number): number[] {
	// Generate random values but ensure they cover the range (include min and max)
	const values = [min, max];
	while (values.length < numValues) {
		const random = Math.floor(Math.random() * (max - min + 1)) + min;
		if (!values.includes(random)) {
			values.push(random);
		}
	}
	return values.sort((a, b) => a - b);
}

function generateMixedColorsByRedness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	// Fix green axis (could also fix blue, saturation, or brightness)
	const fixedG = Math.floor(Math.random() * 256);
	
	// Generate non-equidistant redness values
	const rValues = generateNonEquidistantValues(numColors, 0, 255);
	
	for (let i = 0; i < numColors; i++) {
		const r = rValues[i];
		const b = Math.floor(Math.random() * 256); // Vary blue
		colors.push({ r, g: fixedG, b });
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateMixedColorsByGreenness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	// Fix red axis
	const fixedR = Math.floor(Math.random() * 256);
	
	// Generate non-equidistant greenness values
	const gValues = generateNonEquidistantValues(numColors, 0, 255);
	
	for (let i = 0; i < numColors; i++) {
		const g = gValues[i];
		const b = Math.floor(Math.random() * 256); // Vary blue
		colors.push({ r: fixedR, g, b });
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateMixedColorsByBlueness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	// Fix red axis
	const fixedR = Math.floor(Math.random() * 256);
	
	// Generate non-equidistant blueness values
	const bValues = generateNonEquidistantValues(numColors, 0, 255);
	
	for (let i = 0; i < numColors; i++) {
		const b = bValues[i];
		const g = Math.floor(Math.random() * 256); // Vary green
		colors.push({ r: fixedR, g, b });
	}
	return colors.sort(() => Math.random() - 0.5);
}

// Hard HSB levels - vary 2 axes (1 fixed), non-equidistant on varying axis
function generateMixedColorsByHue(numColors: number): RGB[] {
	const colors: RGB[] = [];
	// Keep saturation fixed, vary hue and brightness
	const s = 50 + Math.floor(Math.random() * 40); // Fixed saturation between 50-90
	
	// Generate non-equidistant hue values (circular, so handle wrap-around)
	const hValues = generateNonEquidistantValues(numColors, 0, 359);
	
	for (let i = 0; i < numColors; i++) {
		const h = hValues[i];
		const v = 50 + Math.floor(Math.random() * 40); // Vary brightness between 50-90
		const color = hsvToRgb(h, s, v);
		colors.push(color);
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateMixedColorsBySaturation(numColors: number): RGB[] {
	const colors: RGB[] = [];
	// Keep hue fixed, vary saturation and brightness
	const h = Math.floor(Math.random() * 360); // Fixed hue
	
	// Generate non-equidistant saturation values
	const sValues = generateNonEquidistantValues(numColors, 0, 100);
	
	for (let i = 0; i < numColors; i++) {
		const s = sValues[i];
		const v = 50 + Math.floor(Math.random() * 40); // Vary brightness between 50-90
		const color = hsvToRgb(h, s, v);
		colors.push(color);
	}
	return colors.sort(() => Math.random() - 0.5);
}

function generateMixedColorsByBrightness(numColors: number): RGB[] {
	const colors: RGB[] = [];
	// Keep hue fixed, vary saturation and brightness
	const h = Math.floor(Math.random() * 360); // Fixed hue
	
	// Generate non-equidistant brightness values
	const vValues = generateNonEquidistantValues(numColors, 0, 100);
	
	for (let i = 0; i < numColors; i++) {
		const v = vValues[i];
		const s = 50 + Math.floor(Math.random() * 40); // Vary saturation between 50-90
		const color = hsvToRgb(h, s, v);
		colors.push(color);
	}
	return colors.sort(() => Math.random() - 0.5);
}

export function getLevelConfig(levelId: string): ColorSortingConfig | null {
	const configs: Record<string, ColorSortingConfig> = {
		'color-sorting-1': {
			numColors: 5,
			property: 'redness',
			generateColors: () => generateColorsByRedness(5),
			title: 'Color Sorting 1: Sort by Redness',
			subtitle: 'Arrange colors from least red to most red (5 colors)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-2': {
			numColors: 5,
			property: 'greenness',
			generateColors: () => generateColorsByGreenness(5),
			title: 'Color Sorting 2: Sort by Greenness',
			subtitle: 'Arrange colors from least green to most green (5 colors)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-3': {
			numColors: 5,
			property: 'blueness',
			generateColors: () => generateColorsByBlueness(5),
			title: 'Color Sorting 3: Sort by Blueness',
			subtitle: 'Arrange colors from least blue to most blue (5 colors)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-4': {
			numColors: 10,
			property: 'redness',
			generateColors: () => generateColorsByRedness(10),
			title: 'Color Sorting 4: More Redness',
			subtitle: 'Sort 10 colors by redness',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-5': {
			numColors: 10,
			property: 'greenness',
			generateColors: () => generateColorsByGreenness(10),
			title: 'Color Sorting 5: More Greenness',
			subtitle: 'Sort 10 colors by greenness',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-6': {
			numColors: 5,
			property: 'hue',
			generateColors: () => generateColorsByHue(5),
			title: 'Color Sorting 6: Sort by Hue',
			subtitle: 'Arrange colors in hue order (circular - any starting point works)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			},
			wordExplanations: {
				hue: 'Hue is the type of color - like red, blue, yellow, green. It\'s what makes a color "red" rather than "blue".'
			}
		},
		'color-sorting-7': {
			numColors: 10,
			property: 'hue',
			generateColors: () => generateColorsByHue(10),
			title: 'Color Sorting 7: More Hues',
			subtitle: 'Sort 10 colors by hue (circular order)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-8': {
			numColors: 5,
			property: 'saturation',
			generateColors: () => generateColorsBySaturation(5),
			title: 'Color Sorting 8: Sort by Saturation',
			subtitle: 'Arrange colors from least saturated to most saturated',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			},
			wordExplanations: {
				saturation: 'Saturation is how intense or vivid a color is. A highly saturated red is bright and vibrant, while a low saturation red looks grayish or washed out.',
				saturated: 'Saturation is how intense or vivid a color is. A highly saturated red is bright and vibrant, while a low saturation red looks grayish or washed out.'
			}
		},
		'color-sorting-9': {
			numColors: 5,
			property: 'brightness',
			generateColors: () => generateColorsByBrightness(5),
			title: 'Color Sorting 9: Sort by Brightness',
			subtitle: 'Arrange colors from darkest to brightest',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			},
			wordExplanations: {
				brightness: 'Brightness is how light or dark a color is. A bright color is light and closer to white, while a dark color is closer to black.'
			}
		},
		'color-sorting-10': {
			numColors: 10,
			property: 'saturation',
			generateColors: () => generateColorsBySaturation(10),
			title: 'Color Sorting 10: More Saturation',
			subtitle: 'Sort 10 colors by saturation',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-11': {
			numColors: 10,
			property: 'brightness',
			generateColors: () => generateColorsByBrightness(10),
			title: 'Color Sorting 11: More Brightness',
			subtitle: 'Sort 10 colors by brightness',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-12': {
			numColors: 20,
			property: 'redness',
			generateColors: () => generateMixedColorsByRedness(20),
			title: 'Color Sorting 12: Challenge Redness',
			subtitle: 'Sort 20 colors by redness (colors vary in other properties too)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-13': {
			numColors: 20,
			property: 'hue',
			generateColors: () => generateMixedColorsByHue(20),
			title: 'Color Sorting 13: Challenge Hue',
			subtitle: 'Sort 20 colors by hue (colors vary in brightness, saturation fixed)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-14': {
			numColors: 50,
			property: 'brightness',
			generateColors: () => generateMixedColorsByBrightness(50),
			title: 'Color Sorting 14: Ultimate Challenge',
			subtitle: 'Sort 50 colors by brightness (colors vary in saturation, hue fixed)',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'swaps',
				maximize: false
			}
		},
		'color-sorting-15': {
			numColors: 50,
			property: 'hue',
			generateColors: () => generateMixedColorsByHue(50),
			title: 'Color Sorting 15: Ultimate Hue Challenge',
			subtitle: 'Sort 50 colors by hue (colors vary in brightness, saturation fixed)',
			source: 'procgen',
			requiredCompletions: 5
		}
	};

	return configs[levelId] || null;
}

