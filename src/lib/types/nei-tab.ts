import type { NeiFiller } from '$lib/types/nei-filler';

export interface NeiTab {
	name: string;
	filler: NeiFiller | null;
	iconId: number;
	isVisible(): boolean;
	dom: HTMLDivElement | null;
}
