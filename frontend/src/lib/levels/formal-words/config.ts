import type { FormalWordsConfig } from './types';

// List of common English words for real word levels
const englishWords = [
	'cat', 'dog', 'bird', 'fish', 'tree', 'house', 'car', 'book', 'pen', 'desk',
	'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'water', 'fire', 'earth',
	'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'black', 'white', 'gray', 'brown',
	'big', 'small', 'tall', 'short', 'long', 'wide', 'narrow', 'thick', 'thin', 'heavy',
	'run', 'walk', 'jump', 'fly', 'swim', 'climb', 'fall', 'rise', 'stop', 'go',
	'apple', 'banana', 'orange', 'grape', 'pear', 'peach', 'berry', 'mango', 'lemon', 'lime'
];

// Generate a random binary word (alphabet: 0, 1)
function generateBinaryWord(length: number): string {
	return Array.from({ length }, () => Math.floor(Math.random() * 2).toString()).join('');
}

// Generate a random hexadecimal word (alphabet: 0-9, a-f)
function generateHexWord(length: number): string {
	const hexChars = '0123456789abcdef';
	return Array.from({ length }, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join('');
}

// Helper to reverse a string
function reverseString(s: string): string {
	return s.split('').reverse().join('');
}

// Check if string is palindrome
function isPalindrome(s: string): boolean {
	return s === reverseString(s);
}

// Check if a is prefix of b
function isPrefix(a: string, b: string): boolean {
	return b.startsWith(a);
}

// Check if a is suffix of b
function isSuffix(a: string, b: string): boolean {
	return b.endsWith(a);
}

// Check if a is substring of b
function isSubstring(a: string, b: string): boolean {
	return b.includes(a);
}

// Generate incorrect options for multiple choice (ensure correct answer is included)
function generateMultipleChoiceOptions(correct: string, alphabet: 'binary' | 'hex', length?: number): string[] {
	const options = new Set<string>([correct]);
	const targetLength = length || correct.length;
	const chars = alphabet === 'binary' ? '01' : '0123456789abcdef';
	
	// Generate unique incorrect options
	while (options.size < 8) {
		const option = Array.from({ length: targetLength }, () => 
			chars[Math.floor(Math.random() * chars.length)]
		).join('');
		if (option !== correct) {
			options.add(option);
		}
	}
	
	// Shuffle and return
	return Array.from(options).sort(() => Math.random() - 0.5);
}

function generateRealConcatenate(): { prompt: string; example: string; correctAnswer: string; options?: string[] } {
	const numWords = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 words
	const words: string[] = [];
	for (let i = 0; i < numWords; i++) {
		const word = englishWords[Math.floor(Math.random() * englishWords.length)];
		words.push(word);
	}
	const correctAnswer = words.join('');
	const prompt = `Concatenate these words: ${words.join(' + ')}`;
	// Generate example: "cat" + "dog" = "catdog"
	const exampleWords = ['cat', 'dog'];
	const example = `Example: "${exampleWords.join('" + "')}" = "${exampleWords.join('')}"`;
	
	return { prompt, example, correctAnswer };
}

function generateFormalConcatenate(): { prompt: string; example: string; correctAnswer: string; options?: string[] } {
	const alphabet = Math.random() < 0.5 ? 'binary' : 'hex';
	const numWords = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 words
	const words: string[] = [];
	
	for (let i = 0; i < numWords; i++) {
		const length = Math.floor(Math.random() * 3) + 2; // 2-4 chars
		words.push(alphabet === 'binary' ? generateBinaryWord(length) : generateHexWord(length));
	}
	
	const correctAnswer = words.join('');
	const prompt = `Concatenate these ${alphabet} words: ${words.join(' + ')}`;
	// Generate example
	const exampleWord1 = alphabet === 'binary' ? generateBinaryWord(2) : generateHexWord(2);
	const exampleWord2 = alphabet === 'binary' ? generateBinaryWord(2) : generateHexWord(2);
	const example = `Example: "${exampleWord1}" + "${exampleWord2}" = "${exampleWord1}${exampleWord2}"`;
	
	return { prompt, example, correctAnswer };
}

function generateRealReverse(): { prompt: string; example: string; correctAnswer: string; options?: string[] } {
	const word = englishWords[Math.floor(Math.random() * englishWords.length)];
	const correctAnswer = reverseString(word);
	const prompt = `Write the reverse of: ${word}`;
	const example = `Example: reverse of "cat" is "tac"`;
	
	return { prompt, example, correctAnswer };
}

function generateFormalReverse(): { prompt: string; example: string; correctAnswer: string; options?: string[] } {
	const alphabet = Math.random() < 0.5 ? 'binary' : 'hex';
	const length = Math.floor(Math.random() * 4) + 3; // 3-6 chars
	const word = alphabet === 'binary' ? generateBinaryWord(length) : generateHexWord(length);
	const correctAnswer = reverseString(word);
	const prompt = `Write the reverse of this ${alphabet} word: ${word}`;
	// Generate example
	const exampleWord = alphabet === 'binary' ? '101' : 'abc';
	const example = `Example: reverse of "${exampleWord}" is "${reverseString(exampleWord)}"`;
	
	return { prompt, example, correctAnswer };
}

function generatePalindromeCheck(): { prompt: string; example: string; correctAnswer: string; options?: [string, string] } {
	const alphabet = Math.random() < 0.5 ? 'binary' : 'hex';
	const length = Math.floor(Math.random() * 4) + 3; // 3-6 chars
	const word = alphabet === 'binary' ? generateBinaryWord(length) : generateHexWord(length);
	
	// Make it a palindrome 50% of the time
	const isPal = Math.random() < 0.5;
	const testWord = isPal ? makePalindrome(word) : word;
	
	const correctAnswer = isPalindrome(testWord) ? 'Yes' : 'No';
	const prompt = `Is "${testWord}" a palindrome?`;
	const options: [string, string] = ['Yes', 'No'];
	const example = alphabet === 'binary' 
		? `Example: "101" is a palindrome, "110" is not`
		: `Example: "aba" is a palindrome, "abc" is not`;
	
	return { prompt, example, correctAnswer, options };
}

// Helper to make a word a palindrome
function makePalindrome(word: string): string {
	if (isPalindrome(word)) return word;
	const half = Math.floor(word.length / 2);
	const firstHalf = word.substring(0, half);
	const middle = word.length % 2 === 1 ? word[half] : '';
	return firstHalf + middle + reverseString(firstHalf);
}

function generateIsPrefix(): { prompt: string; example: string; correctAnswer: string; options?: [string, string] } {
	const alphabet = Math.random() < 0.5 ? 'binary' : 'hex';
	const baseLength = Math.floor(Math.random() * 4) + 4; // 4-7 chars
	const baseWord = alphabet === 'binary' ? generateBinaryWord(baseLength) : generateHexWord(baseLength);
	
	const isPrefix = Math.random() < 0.5;
	let prefixWord: string;
	if (isPrefix) {
		// Generate a word that is a prefix
		const prefixLength = Math.floor(Math.random() * (baseLength - 1)) + 1; // 1 to baseLength-1
		prefixWord = baseWord.substring(0, prefixLength);
	} else {
		// Generate a word that is NOT a prefix
		const prefixLength = Math.floor(Math.random() * 3) + 1; // 1-3 chars
		prefixWord = alphabet === 'binary' ? generateBinaryWord(prefixLength) : generateHexWord(prefixLength);
		// Make sure it's not actually a prefix
		if (baseWord.startsWith(prefixWord)) {
			prefixWord = prefixWord + (alphabet === 'binary' ? '1' : 'a');
		}
	}
	
	const correctAnswer = isPrefix ? 'Yes' : 'No';
	const prompt = `Is "${prefixWord}" a prefix of "${baseWord}"?`;
	const options: [string, string] = ['Yes', 'No'];
	const example = alphabet === 'binary'
		? `Example: "10" is a prefix of "1011", but "11" is not a prefix of "1011"`
		: `Example: "ab" is a prefix of "abcd", but "cd" is not a prefix of "abcd"`;
	
	return { prompt, example, correctAnswer, options };
}

function generateIsSuffix(): { prompt: string; example: string; correctAnswer: string; options?: [string, string] } {
	const alphabet = Math.random() < 0.5 ? 'binary' : 'hex';
	const baseLength = Math.floor(Math.random() * 4) + 4; // 4-7 chars
	const baseWord = alphabet === 'binary' ? generateBinaryWord(baseLength) : generateHexWord(baseLength);
	
	const isSuffix = Math.random() < 0.5;
	let suffixWord: string;
	if (isSuffix) {
		// Generate a word that is a suffix
		const suffixLength = Math.floor(Math.random() * (baseLength - 1)) + 1; // 1 to baseLength-1
		suffixWord = baseWord.substring(baseLength - suffixLength);
	} else {
		// Generate a word that is NOT a suffix
		const suffixLength = Math.floor(Math.random() * 3) + 1; // 1-3 chars
		suffixWord = alphabet === 'binary' ? generateBinaryWord(suffixLength) : generateHexWord(suffixLength);
		// Make sure it's not actually a suffix
		if (baseWord.endsWith(suffixWord)) {
			suffixWord = (alphabet === 'binary' ? '1' : 'a') + suffixWord;
		}
	}
	
	const correctAnswer = isSuffix ? 'Yes' : 'No';
	const prompt = `Is "${suffixWord}" a suffix of "${baseWord}"?`;
	const options: [string, string] = ['Yes', 'No'];
	const example = alphabet === 'binary'
		? `Example: "11" is a suffix of "1011", but "10" is not a suffix of "1011"`
		: `Example: "cd" is a suffix of "abcd", but "ab" is not a suffix of "abcd"`;
	
	return { prompt, example, correctAnswer, options };
}

function generateIsSubstring(): { prompt: string; example: string; correctAnswer: string; options?: [string, string] } {
	const alphabet = Math.random() < 0.5 ? 'binary' : 'hex';
	const baseLength = Math.floor(Math.random() * 4) + 5; // 5-8 chars
	const baseWord = alphabet === 'binary' ? generateBinaryWord(baseLength) : generateHexWord(baseLength);
	
	const isSub = Math.random() < 0.5;
	let subWord: string;
	if (isSub) {
		// Generate a word that is a substring
		const start = Math.floor(Math.random() * (baseLength - 2)); // Start position
		const subLength = Math.floor(Math.random() * Math.min(3, baseLength - start)) + 1; // 1-3 chars
		subWord = baseWord.substring(start, start + subLength);
	} else {
		// Generate a word that is NOT a substring
		const subLength = Math.floor(Math.random() * 3) + 1; // 1-3 chars
		subWord = alphabet === 'binary' ? generateBinaryWord(subLength) : generateHexWord(subLength);
		// Make sure it's not actually a substring
		if (baseWord.includes(subWord)) {
			subWord = (alphabet === 'binary' ? '10' : 'ab') + subWord;
		}
	}
	
	const correctAnswer = isSub ? 'Yes' : 'No';
	const prompt = `Is "${subWord}" a substring of "${baseWord}"?`;
	const options: [string, string] = ['Yes', 'No'];
	const example = alphabet === 'binary'
		? `Example: "01" is a substring of "1011", but "00" is not a substring of "1011"`
		: `Example: "bc" is a substring of "abcd", but "ac" is not a substring of "abcd"`;
	
	return { prompt, example, correctAnswer, options };
}

export function getLevelConfig(levelId: string): FormalWordsConfig | null {
	const configs: Record<string, FormalWordsConfig> = {
		'formal-words-1': {
			levelType: 'real-concatenate',
			answerType: 'text',
			title: 'Formal Words 1: Real Word Concatenation',
			subtitle: 'Concatenate 2-4 English words together',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			wordExplanations: {
				concatenate: 'To concatenate means to join words together in order, one after another. For example, "cat" + "dog" = "catdog".',
				concatenation: 'Concatenation means joining words together in order, one after another. For example, "cat" + "dog" = "catdog".'
			},
			generateQuestion: generateRealConcatenate
		},
		'formal-words-2': {
			levelType: 'formal-concatenate',
			answerType: 'text',
			title: 'Formal Words 2: Formal Word Concatenation',
			subtitle: 'Concatenate 2-4 binary or hexadecimal words together',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			generateQuestion: generateFormalConcatenate
		},
		'formal-words-3': {
			levelType: 'real-reverse',
			answerType: 'text',
			title: 'Formal Words 3: Real Word Reverse',
			subtitle: 'Write the reverse of an English word',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			generateQuestion: generateRealReverse
		},
		'formal-words-4': {
			levelType: 'formal-reverse',
			answerType: 'text',
			title: 'Formal Words 4: Formal Word Reverse',
			subtitle: 'Write the reverse of a binary or hexadecimal word',
			source: 'procgen',
			requiredCompletions: 5,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			generateQuestion: generateFormalReverse
		},
		'formal-words-5': {
			levelType: 'palindrome-check',
			answerType: 'binary',
			title: 'Formal Words 5: Palindrome Check',
			subtitle: 'Determine if a binary or hexadecimal word is a palindrome',
			source: 'procgen',
			requiredCompletions: 20,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			wordExplanations: {
				palindrome: 'A palindrome is a word that reads the same forwards and backwards. For example, "101" and "aba" are palindromes.'
			},
			generateQuestion: generatePalindromeCheck
		},
		'formal-words-6': {
			levelType: 'isPrefix',
			answerType: 'binary',
			title: 'Formal Words 6: Is Prefix',
			subtitle: 'Determine if one word is a prefix of another',
			source: 'procgen',
			requiredCompletions: 20,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			wordExplanations: {
				prefix: 'A prefix is a word that appears at the beginning of another word. For example, "ab" is a prefix of "abcd".'
			},
			generateQuestion: generateIsPrefix
		},
		'formal-words-7': {
			levelType: 'isSuffix',
			answerType: 'binary',
			title: 'Formal Words 7: Is Suffix',
			subtitle: 'Determine if one word is a suffix of another',
			source: 'procgen',
			requiredCompletions: 20,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			wordExplanations: {
				suffix: 'A suffix is a word that appears at the end of another word. For example, "cd" is a suffix of "abcd".'
			},
			generateQuestion: generateIsSuffix
		},
		'formal-words-8': {
			levelType: 'isSubstring',
			answerType: 'binary',
			title: 'Formal Words 8: Is Substring',
			subtitle: 'Determine if one word is a substring of another',
			source: 'procgen',
			requiredCompletions: 20,
			scoreConfig: {
				primaryScore: 'attempts',
				target: 'minimize'
			},
			wordExplanations: {
				substring: 'A substring is a word that appears anywhere inside another word (at the beginning, middle, or end). For example, "bc" is a substring of "abcd".'
			},
			generateQuestion: generateIsSubstring
		}
	};

	return configs[levelId] || null;
}

