import { getLevelConfig } from './boolean-gates/config';
import { getLevelConfig as getColorSortingConfig } from './color-sorting/config';
import { getLevelConfig as getControlZoneConfig } from './control-zone/config';
import { getLevelConfig as getFormalWordsConfig } from './formal-words/config';
import { getLessonConfig } from './lesson/config';

export type LevelMeta = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    section?: string;
    source: 'procgen' | 'fixed'; // Whether level uses procedural generation or is fixed
    requiredCompletions: number; // Number of consecutive successes required to validate the level
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
            source: config.source,
            requiredCompletions: config.requiredCompletions
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
            source: config.source,
            requiredCompletions: config.requiredCompletions
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
            source: config.source,
            requiredCompletions: config.requiredCompletions
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
            source: config.source,
            requiredCompletions: config.requiredCompletions
        };
    });
}

function createLessonMeta(sectionId: string): LevelMeta | null {
    const lessonId = `lesson-${sectionId}`;
    const lessonConfig = getLessonConfig(lessonId);
    if (!lessonConfig) {
        return null;
    }
    return {
        id: lessonId,
        title: lessonConfig.title,
        description: 'Introduction lesson for this section',
        tags: ['lesson', 'introduction'],
        section: sectionId,
        source: 'fixed',
        requiredCompletions: 1
    };
}

export const sections: LevelSection[] = [
    {
        id: 'boolean-gates',
        title: 'Boolean Gates',
        levels: (() => {
            const lesson = createLessonMeta('boolean-gates');
            return lesson ? [lesson, ...getBooleanGatesLevels()] : getBooleanGatesLevels();
        })()
    },
    {
        id: 'color-sorting',
        title: 'Color Sorting',
        levels: (() => {
            const lesson = createLessonMeta('color-sorting');
            return lesson ? [lesson, ...getColorSortingLevels()] : getColorSortingLevels();
        })()
    },
    {
        id: 'control-zone',
        title: 'Control Zone',
        levels: (() => {
            const lesson = createLessonMeta('control-zone');
            return lesson ? [lesson, ...getControlZoneLevels()] : getControlZoneLevels();
        })()
    },
    {
        id: 'formal-words',
        title: 'Formal Words',
        levels: (() => {
            const lesson = createLessonMeta('formal-words');
            return lesson ? [lesson, ...getFormalWordsLevels()] : getFormalWordsLevels();
        })()
    }
];

// Flattened list for backward compatibility
export const levels: LevelMeta[] = sections.flatMap(section => section.levels);



