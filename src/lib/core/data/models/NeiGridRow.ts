import type {NeiRowAllocator} from "$lib/types/nei-row-allocator.interface";
import type {NeiGridContents} from "$lib/types/nei-grid-contents";

export class NeiGridRow {
    y: number = 0;
    height: number = 1;
    elementWidth: number = 1;
    elements: NeiGridContents[] = [];
    allocator: NeiRowAllocator<any> | null = null;

    Clear(y: number, allocator: NeiRowAllocator<any> | null, elementWidth: number) {
        this.allocator = allocator;
        this.y = y;
        this.height = 1;
        this.elementWidth = elementWidth;
        this.elements.length = 0;
    }

    Add(element: NeiGridContents, height: number) {
        this.elements.push(element);
        if (height > this.height) this.height = height;
    }
}
