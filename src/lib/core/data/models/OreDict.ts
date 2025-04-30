import {RecipeObject} from "$lib/core/data/models/RecipeObject";
import type {Repository} from "$lib/core/data/Repository";
import {Item} from "$lib/core/data/models/Item";
import {SearchQuery} from "$lib/core/data/models/SearchQuery";

export class OreDict extends RecipeObject
{
    items:Item[];

    constructor(repository:Repository, offset:number) {
        super(repository, offset);
        var slice = this.GetSlice(5);
        this.items = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            this.items[i] = repository.GetObject(slice[i], Item);
        }
    }

    MatchSearchText(query: SearchQuery): boolean
    {
        var items = this.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (this.repository.ObjectMatchQueryBits(query, item.objectOffset) && item.MatchSearchText(query))
                return true;
        }
        return false;
    }
}