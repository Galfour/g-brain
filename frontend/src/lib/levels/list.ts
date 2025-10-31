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

export const sections: LevelSection[] = [
    {
        id: 'boolean-gates',
        title: 'Boolean Gates',
        levels: [
            {
                id: 'boolean-gates-1',
                title: 'Boolean Gates 1: Simple AND',
                description: 'Open the door using a simple AND gate.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-2',
                title: 'Boolean Gates 2: OR Gate',
                description: 'Two inputs, one output - use OR logic.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-3',
                title: 'Boolean Gates 3: XOR Challenge',
                description: 'Master the exclusive OR operation.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-4',
                title: 'Boolean Gates 4: NAND Logic',
                description: 'Combine AND with NOT for NAND.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-5',
                title: 'Boolean Gates 5: Triple Input',
                description: 'Three inputs, one output - increasing complexity.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-6',
                title: 'Boolean Gates 6: Multiple Outputs',
                description: 'Two outputs from three inputs.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-7',
                title: 'Boolean Gates 7: Complex Combination',
                description: 'Combine multiple gates for a challenge.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-8',
                title: 'Boolean Gates 8: Four Input Mastery',
                description: 'Four inputs require careful logic.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-9',
                title: 'Boolean Gates 9: Advanced Patterns',
                description: 'Complex boolean expressions with multiple outputs.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            },
            {
                id: 'boolean-gates-10',
                title: 'Boolean Gates 10: Ultimate Challenge',
                description: 'The most complex boolean puzzle.',
                tags: ['logic', 'boolean'],
                section: 'boolean-gates'
            }
        ]
    }
];

// Flattened list for backward compatibility
export const levels: LevelMeta[] = sections.flatMap(section => section.levels);



