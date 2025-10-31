export type ColorProperty = 'redness' | 'greenness' | 'blueness' | 'hue' | 'saturation' | 'brightness';

export type ColorSortingConfig = {
	numColors: number; // 5, 10, 20, 50
	property: ColorProperty;
	generateColors: () => string[]; // Function that generates unique colors
	title: string;
	subtitle: string;
};

// Helper functions to extract color properties from hex color
export function getRedness(color: string): number {
	const hex = color.replace('#', '');
	const r = parseInt(hex.substring(0, 2), 16);
	return r;
}

export function getGreenness(color: string): number {
	const hex = color.replace('#', '');
	const g = parseInt(hex.substring(2, 4), 16);
	return g;
}

export function getBlueness(color: string): number {
	const hex = color.replace('#', '');
	const b = parseInt(hex.substring(4, 6), 16);
	return b;
}

// Convert RGB to HSV for hue, saturation, brightness
export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const diff = max - min;

	let h = 0;
	if (diff !== 0) {
		if (max === r) {
			h = ((g - b) / diff) % 6;
		} else if (max === g) {
			h = (b - r) / diff + 2;
		} else {
			h = (r - g) / diff + 4;
		}
	}
	h = Math.round(h * 60);
	if (h < 0) h += 360;

	const s = max === 0 ? 0 : diff / max;
	const v = max;

	return { h, s, v };
}

export function getHue(color: string): number {
	const r = getRedness(color);
	const g = getGreenness(color);
	const b = getBlueness(color);
	return rgbToHsv(r, g, b).h;
}

export function getSaturation(color: string): number {
	const r = getRedness(color);
	const g = getGreenness(color);
	const b = getBlueness(color);
	return Math.round(rgbToHsv(r, g, b).s * 100);
}

export function getBrightness(color: string): number {
	const r = getRedness(color);
	const g = getGreenness(color);
	const b = getBlueness(color);
	return Math.round(rgbToHsv(r, g, b).v * 100);
}

// Get property value for a color
export function getPropertyValue(color: string, property: ColorProperty): number {
	switch (property) {
		case 'redness':
			return getRedness(color);
		case 'greenness':
			return getGreenness(color);
		case 'blueness':
			return getBlueness(color);
		case 'hue':
			return getHue(color);
		case 'saturation':
			return getSaturation(color);
		case 'brightness':
			return getBrightness(color);
	}
}

// Sort colors by property value
export function sortColorsByProperty(colors: string[], property: ColorProperty): string[] {
	return [...colors].sort((a, b) => {
		const valA = getPropertyValue(a, property);
		const valB = getPropertyValue(b, property);
		return valA - valB;
	});
}

// Check if colors are sorted correctly (for hue, check if circular order is correct)
export function isSorted(colors: string[], property: ColorProperty, correctOrder: string[]): boolean {
	if (property === 'hue') {
		// For hue, check if it's a circular permutation
		// Try all rotations of correctOrder
		for (let offset = 0; offset < correctOrder.length; offset++) {
			const rotated = [...correctOrder.slice(offset), ...correctOrder.slice(0, offset)];
			if (rotated.every((color, i) => color === colors[i])) {
				return true;
			}
		}
		return false;
	} else {
		// For other properties, exact match required
		return colors.every((color, i) => color === correctOrder[i]);
	}
}

