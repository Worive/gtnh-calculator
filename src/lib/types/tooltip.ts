import {type Recipe} from "$lib/legacy/repository";

export interface TooltipPosition {
    left: number;
    top: number;
}

export interface TooltipContent {
    header: string;
    debug?: string;
    text?: string;
    action?: string;
    mod?: string;
    recipe?: Recipe | null;
}

export interface TooltipState {
    visible: boolean;
    content: TooltipContent | null;
    targetElement: HTMLElement | null;
    position: TooltipPosition;
}