import { LinkAlgorithm } from '$lib/types/enums/LinkAlgorithm';

export const linkAlgorithmNames: { [key in LinkAlgorithm]: string } = {
	[LinkAlgorithm.Match]: '',
	[LinkAlgorithm.Ignore]: 'Ignore'
};
