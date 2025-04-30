import {RecipeGroupEntry} from "$lib/core/data/models/RecipeGroupEntry";
import type {ModelObjectVisitor} from "$lib/core/data/models/ModelObjectVisitor";
import {RecipeModel} from "$lib/core/data/models/RecipeModel";
import type {LinkAlgorithm} from "$lib/types/enums/LinkAlgorithm";


export class RecipeGroupModel extends RecipeGroupEntry
{
    links: {[key:string]:LinkAlgorithm} = {};
    actualLinks: {[key:string]:LinkAlgorithm} = {};
    elements: RecipeGroupEntry[] = [];
    collapsed: boolean = false;
    name: string = "Group";

    Visit(visitor: ModelObjectVisitor): void {
        visitor.VisitData(this, "type", "recipe_group");
        visitor.VisitData(this, "links", this.links);
        visitor.VisitArray(this, "elements", this.elements);
        visitor.VisitData(this, "collapsed", this.collapsed);
        visitor.VisitData(this, "name", this.name);
    }

    constructor(source:any = undefined)
    {
        super();
        if (source instanceof Object) {
            if (source.links instanceof Object)
                this.links = source.links;
            if (source.elements instanceof Array)
                this.elements = source.elements.map((element: any) => {
                    if (element.type === "recipe")
                        return new RecipeModel(element);
                    else
                        return new RecipeGroupModel(element);
                });
            if (source.collapsed === true)
                this.collapsed = true;
            if (typeof source.name === "string")
                this.name = source.name;
        }
    }
}