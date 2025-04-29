import {writable} from 'svelte/store';

type DialogOptions = {
    text: string;
    option1: string | null;
    option2: string | null;
    cancel: string | null;
};

export const dialogStore = writable<{
    show: boolean;
    options: DialogOptions;
    resolver?: (value: 'option1' | 'option2' | 'cancel') => void;
}>({
    show: false,
    options: {text: '', option1: null, option2: null, cancel: null}
});

export function showConfirmDialog(
    text: string,
    option1: string | null = "Yes",
    option2: string | null = "No",
    cancel: string | null = null
): Promise<"option1" | "option2" | "cancel"> {
    return new Promise((resolve) => {
        dialogStore.set({
            show: true,
            options: {text, option1, option2, cancel},
            resolver: resolve
        });
    });
}