export type BooleanFunction = (inputs: boolean[]) => boolean[];

export type BooleanGatesConfig = {
	maxLevers: number;
	maxActiveLevers: number;
	activeLeverIndices: number[]; // Indices (0-based) of levers that are connected to the function
	numOutputs: number;
	booleanFunction: BooleanFunction;
	title: string;
	subtitle: string;
};
