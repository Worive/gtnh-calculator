import {Goods, Recipe} from "$lib/legacy/repository";

export type ShowNeiCallback = {
    onSelectGoods?(goods:Goods):void;
    onSelectRecipe?(recipe:Recipe):void;
}