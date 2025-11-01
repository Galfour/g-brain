import { getLevelConfig } from './boolean-gates/config';
import { getLevelConfig as getColorSortingConfig } from './color-sorting/config';
import { getLevelConfig as getControlZoneConfig } from './control-zone/config';
import { getLevelConfig as getFormalWordsConfig } from './formal-words/config';

export type LevelMeta = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    section?: string;
    isProcgen: boolean; // true if level uses procedural generation, false if fixed
};

export type LevelSection = {
    id: string;
    title: string;
    levels: LevelMeta[];
};

// Generate boolean gates levels from config
function getBooleanGatesLevels(): LevelMeta[] {
    const levelIds = Array.from({ length: 10 }, (_, i) => `boolean-gates-${i + 1}`);
    return levelIds.map(id => {
        const config = getLevelConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['logic', 'boolean'],
            section: 'boolean-gates',
            isProcgen: config.isProcgen ?? false
        };
    });
}

// Generate color sorting levels from config
function getColorSortingLevels(): LevelMeta[] {
    const levelIds = Array.from({ length: 15 }, (_, i) => `color-sorting-${i + 1}`);
    return levelIds.map(id => {
        const config = getColorSortingConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['colors', 'sorting', config.property],
            section: 'color-sorting',
            isProcgen: config.isProcgen ?? false
        };
    });
}

// Generate control zone levels from config
function getControlZoneLevels(): LevelMeta[] {
    const levelIds = Array.from({ length: 4 }, (_, i) => `control-zone-${i + 1}`);
    return levelIds.map(id => {
        const config = getControlZoneConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['control', 'navigation', 'spatial'],
            section: 'control-zone',
            isProcgen: config.isProcgen ?? false
        };
    });
}

// Generate formal words levels from config
function getFormalWordsLevels(): LevelMeta[] {
    const levelIds = Array.from({ length: 8 }, (_, i) => `formal-words-${i + 1}`);
    return levelIds.map(id => {
        const config = getFormalWordsConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['formal', 'words', 'strings'],
            section: 'formal-words',
            isProcgen: config.isProcgen ?? false
        };
    });
}

export const sections: LevelSection[] = [
    {
        id: 'boolean-gates',
        title: 'Boolean Gates',
        levels: getBooleanGatesLevels()
    },
    {
        id: 'color-sorting',
        title: 'Color Sorting',
        levels: getColorSortingLevels()
    },
    {
        id: 'control-zone',
        title: 'Control Zone',
        levels: getControlZoneLevels()
    },
    {
        id: 'formal-words',
        title: 'Formal Words',
        levels: getFormalWordsLevels()
    }
];

// Flattened list for backward compatibility
export const levels: LevelMeta[] = sections.flatMap(section => section.levels);



