export type ColorProperty = 'redness' | 'greenness' | 'blueness' | 'hue' | 'saturation' | 'brightness';

export type RGB = { r: number; g: number; b: number };

export type ColorSortingConfig = {
	numColors: number; // 5, 10, 20, 50
	property: ColorProperty;
	generateColors: () => RGB[]; // Function that generates unique colors
	title: string;
	subtitle: string;
	isProcgen: boolean; // true if level uses procedural generation, false if fixed
};

// Helper to convert RGB to hex string for CSS
export function rgbToHex(rgb: RGB): string {
	return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
}

// Helper to convert RGB to CSS color string
export function rgbToCss(rgb: RGB): string {
	return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// Helper functions to extract color properties from RGB
export function getRedness(color: RGB): number {
	return color.r;
}

export function getGreenness(color: RGB): number {
	return color.g;
}

export function getBlueness(color: RGB): number {
	return color.b;
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

export function getHue(color: RGB): number {
	return rgbToHsv(color.r, color.g, color.b).h;
}

export function getSaturation(color: RGB): number {
	return Math.round(rgbToHsv(color.r, color.g, color.b).s * 100);
}

export function getBrightness(color: RGB): number {
	return Math.round(rgbToHsv(color.r, color.g, color.b).v * 100);
}

// Get property value for a color
export function getPropertyValue(color: RGB, property: ColorProperty): number {
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
export function sortColorsByProperty(colors: RGB[], property: ColorProperty): RGB[] {
	return [...colors].sort((a, b) => {
		const valA = getPropertyValue(a, property);
		const valB = getPropertyValue(b, property);
		return valA - valB;
	});
}

// Check if colors are sorted correctly (for hue, check if circular order is correct)
export function isSorted(colors: RGB[], property: ColorProperty, correctOrder: RGB[]): boolean {
	// Helper to compare two RGB colors
	const colorsEqual = (a: RGB, b: RGB) => a.r === b.r && a.g === b.g && a.b === b.b;

	if (property === 'hue') {
		// For hue, check if it's a circular permutation
		// Try all rotations of correctOrder
		for (let offset = 0; offset < correctOrder.length; offset++) {
			const rotated = [...correctOrder.slice(offset), ...correctOrder.slice(0, offset)];
			if (rotated.every((color, i) => colorsEqual(color, colors[i]))) {
				return true;
			}
		}
		return false;
	} else {
		// For other properties, exact match required
		return colors.every((color, i) => colorsEqual(color, correctOrder[i]));
	}
}

