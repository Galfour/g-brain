import { getLevelConfig } from './boolean-gates/config';

export type LevelMeta = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    section?: string;
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
            section: 'boolean-gates'
        };
    });
}

export const sections: LevelSection[] = [
    {
        id: 'boolean-gates',
        title: 'Boolean Gates',
        levels: getBooleanGatesLevels()
    }
];

// Flattened list for backward compatibility
export const levels: LevelMeta[] = sections.flatMap(section => section.levels);



