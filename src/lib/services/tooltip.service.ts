import { tooltipStore } from '$lib/stores/tooltip.store';
import type { Goods, Recipe } from '$lib/legacy/repository';
import type { TooltipContent } from '$lib/types/tooltip';
import {get} from "svelte/store";

export class TooltipService {
    static show(target: HTMLElement, data: {
        header?: string;
        text?: string;
        action?: string;
        goods?: Goods;
        recipe?: Recipe | null;
    }): void {
        const content = this.prepareContent(data);
        tooltipStore.update(store => ({
            ...store,
            visible: true,
            content,
            targetElement: target
        }));

        target.addEventListener("mouseleave", () => TooltipService.hide(), { once: true });
    }

    static hide(): void {
        tooltipStore.update(store => ({
            ...store,
            visible: false,
            content: null,
            targetElement: null
        }));
    }

    static isHovered(element: HTMLElement): boolean {
        const { targetElement } = get(tooltipStore);
        return targetElement === element;
    }

    private static prepareContent(data: {
        header?: string;
        text?: string;
        action?: string;
        goods?: Goods;
        recipe?: Recipe | null;
    }): TooltipContent {
        return {
            header: data.goods?.name ?? data.header ?? '',
            debug: data.goods?.tooltipDebugInfo,
            text: data.goods?.tooltip ?? data.text,
            action: data.action,
            mod: data.goods?.mod,
            recipe: data.recipe
        };
    }
}