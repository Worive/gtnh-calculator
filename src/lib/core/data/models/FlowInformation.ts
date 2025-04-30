import type {RecipeObject} from "$lib/core/data/models/RecipeObject";

export class FlowInformation {
    input: {[key:string]:number} = {};
    output: {[key:string]:number} = {};
    energy: {[key:number]:number} = {};

    Add(goods:RecipeObject, amount:number, isOutput:boolean) {
        if (isOutput) {
            this.output[goods.id] = (this.output[goods.id] || 0) + amount;
        } else {
            this.input[goods.id] = (this.input[goods.id] || 0) + amount;
        }
    }

    Merge(other:FlowInformation) {
        for (const key in other.input) {
            if (other.input[key] === 0) continue;
            this.input[key] = (this.input[key] || 0) + other.input[key];
        }
        for (const key in other.output) {
            if (other.output[key] === 0) continue;
            this.output[key] = (this.output[key] || 0) + other.output[key];
        }
        for (const key in other.energy) {
            if (other.energy[key] === 0) continue;
            this.energy[key] = (this.energy[key] || 0) + other.energy[key];
        }
    }
}