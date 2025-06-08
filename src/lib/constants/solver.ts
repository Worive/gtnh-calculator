import { LinkAlgorithm } from '$lib/types/enums/linkAlgorithm';

export const linkAlgorithmNames: { [key in LinkAlgorithm]: string } = {
	[LinkAlgorithm.Match]: '',
	[LinkAlgorithm.Ignore]: 'Ignore'
};
