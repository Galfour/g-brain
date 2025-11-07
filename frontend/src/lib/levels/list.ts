import { getLevelConfig } from './boolean-gates/config';
import { getLevelConfig as getColorSortingConfig } from './color-sorting/config';
import { getLevelConfig as getControlZoneConfig } from './control-zone/config';
import { getLevelConfig as getFormalWordsConfig } from './formal-words/config';
import { getLessonConfig } from './lesson/config';
import { m } from '$lib/paraglide/messages.js';

export type LevelMeta = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    source: 'procgen' | 'fixed'; // Whether level uses procedural generation or is fixed
    requiredCompletions: number; // Number of consecutive successes required to validate the level
};

// Tree-based structure supporting arbitrary nesting
export type LevelNode = LevelItem | LevelFolder;

export type LevelItem = {
    type: 'level';
    id: string;
    title: string;
    description: string;
    tags: string[];
    source: 'procgen' | 'fixed';
    requiredCompletions: number;
};

export type LevelFolder = {
    type: 'folder';
    id: string;
    title: string;
    children: LevelNode[];
};

// Legacy types for backward compatibility
export type LevelSection = {
    id: string;
    title: string;
    levels: LevelMeta[];
};

// Generate boolean gates levels from config
function getBooleanGatesLevels(): LevelItem[] {
    const levelIds = Array.from({ length: 10 }, (_, i) => `boolean-gates-${i + 1}`);
    return levelIds.map(id => {
        const config = getLevelConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            type: 'level' as const,
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['logic', 'boolean'],
            source: config.source,
            requiredCompletions: config.requiredCompletions
        };
    });
}

// Generate color sorting levels from config
function getColorSortingLevels(): LevelItem[] {
    const levelIds = Array.from({ length: 15 }, (_, i) => `color-sorting-${i + 1}`);
    return levelIds.map(id => {
        const config = getColorSortingConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            type: 'level' as const,
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['colors', 'sorting', config.property],
            source: config.source,
            requiredCompletions: config.requiredCompletions
        };
    });
}

// Generate control zone levels from config
function getControlZoneLevels(): LevelItem[] {
    const levelIds = Array.from({ length: 4 }, (_, i) => `control-zone-${i + 1}`);
    return levelIds.map(id => {
        const config = getControlZoneConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            type: 'level' as const,
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['control', 'navigation', 'spatial'],
            source: config.source,
            requiredCompletions: config.requiredCompletions
        };
    });
}

// Generate formal words levels from config
function getFormalWordsLevels(): LevelItem[] {
    const levelIds = Array.from({ length: 8 }, (_, i) => `formal-words-${i + 1}`);
    return levelIds.map(id => {
        const config = getFormalWordsConfig(id);
        if (!config) {
            throw new Error(`Missing config for level: ${id}`);
        }
        return {
            type: 'level' as const,
            id,
            title: config.title,
            description: config.subtitle,
            tags: ['formal', 'words', 'strings'],
            source: config.source,
            requiredCompletions: config.requiredCompletions
        };
    });
}

function createLessonItem(folderId: string): LevelItem | null {
    const lessonId = `lesson-${folderId}`;
    const lessonConfig = getLessonConfig(lessonId);
    if (!lessonConfig) {
        return null;
    }
    return {
        type: 'level' as const,
        id: lessonId,
        title: lessonConfig.title,
        description: m.lesson_intro_description(),
        tags: ['lesson', 'introduction'],
        source: 'fixed',
        requiredCompletions: 1
    };
}

// Root tree structure - Note: This needs to be a function to access messages at runtime
// But since it's exported as const, we'll need to make it reactive or use a getter
// For now, we'll create a function that returns the root structure
function getRoot(): LevelFolder {
    return {
        type: 'folder',
        id: 'root',
        title: m.levels_root(),
        children: [
            // color-sorting at root
            {
                type: 'folder',
                id: 'color-sorting',
                title: m.folder_color_sorting(),
                children: (() => {
                    const lesson = createLessonItem('color-sorting');
                    return lesson ? [lesson, ...getColorSortingLevels()] : getColorSortingLevels();
                })()
            },
            // control-zone at root
            {
                type: 'folder',
                id: 'control-zone',
                title: m.folder_control_zone(),
                children: (() => {
                    const lesson = createLessonItem('control-zone');
                    return lesson ? [lesson, ...getControlZoneLevels()] : getControlZoneLevels();
                })()
            },
            // formalism section containing boolean-gates and formal-words
            {
                type: 'folder',
                id: 'formalism',
                title: m.folder_formalism(),
                children: [
                    {
                        type: 'folder',
                        id: 'boolean-gates',
                        title: m.folder_boolean_gates(),
                        children: (() => {
                            const lesson = createLessonItem('boolean-gates');
                            return lesson ? [lesson, ...getBooleanGatesLevels()] : getBooleanGatesLevels();
                        })()
                    },
                    {
                        type: 'folder',
                        id: 'formal-words',
                        title: m.folder_formal_words(),
                        children: (() => {
                            const lesson = createLessonItem('formal-words');
                            return lesson ? [lesson, ...getFormalWordsLevels()] : getFormalWordsLevels();
                        })()
                    }
                ]
            }
        ]
    };
}

// Export as a getter to ensure messages are accessed at runtime
export const root = getRoot();

// Helper functions for tree traversal
export function findNodeByPath(root: LevelFolder, path: string[]): LevelNode | null {
    if (path.length === 0) {
        return root;
    }
    
    let current: LevelNode = root;
    for (const segment of path) {
        if (current.type === 'folder') {
            const found: LevelNode | undefined = current.children.find(child => child.id === segment);
            if (!found) {
                return null;
            }
            current = found;
        } else {
            return null; // Can't traverse into a level
        }
    }
    return current;
}

export function getAllLevels(node: LevelNode = root): LevelItem[] {
    if (node.type === 'level') {
        return [node];
    }
    return node.children.flatMap(child => getAllLevels(child));
}

export function getAllFolders(node: LevelNode = root): LevelFolder[] {
    if (node.type === 'level') {
        return [];
    }
    const folders: LevelFolder[] = [node];
    node.children.forEach(child => {
        if (child.type === 'folder') {
            folders.push(...getAllFolders(child));
        }
    });
    return folders;
}

// Flattened list for backward compatibility
export const levels: LevelMeta[] = getAllLevels().map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    tags: item.tags,
    source: item.source,
    requiredCompletions: item.requiredCompletions
}));

// Legacy sections for backward compatibility (flat structure)
export const sections: LevelSection[] = getAllFolders()
    .filter(folder => folder.id !== 'root') // Exclude root
    .map(folder => ({
        id: folder.id,
        title: folder.title,
        levels: getAllLevels(folder).map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            tags: item.tags,
            source: item.source,
            requiredCompletions: item.requiredCompletions
        }))
    }));



