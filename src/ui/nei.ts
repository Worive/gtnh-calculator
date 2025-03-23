import { GetScrollbarWidth } from "../utils.js";
import { Goods, Fluid, Item, Repository, IMemMappedObjectPrototype, Recipe, RecipeType } from "../data/repository.js";
import { IconBox } from "./iconBox.js";
import { SearchQuery } from "../data/searchQuery.js";
import { RecipeBox } from "./recipeBox.js";

const repository = Repository.current;
const nei = document.getElementById("nei")!;
const neiScrollBox = nei.querySelector("#nei-scroll") as HTMLElement;
const neiContent = nei.querySelector("#nei-content") as HTMLElement;
const searchBox = nei.querySelector("#nei-search") as HTMLInputElement;
const elementSize = 36;

searchBox.addEventListener("input", SearchChanged);
neiScrollBox.addEventListener("scroll", UpdateVisibleItems);

let unitWidth = 0, unitHeight = 0;
const scrollWidth = GetScrollbarWidth();
window.addEventListener("resize", Resize);

type NeiFiller = (grid:NeiGrid, search : SearchQuery | null, recipes:NeiRecipeMap) => void;

class ItemAllocator implements NeiRowAllocator<Goods>
{
    CalculateWidth(): number { return 1; }
    CalculateHeight(obj: Goods): number { return 1; }
}

let itemAllocator = new ItemAllocator();
var FillNeiAllItems:NeiFiller = function(grid:NeiGrid, search : SearchQuery | null)
{
    var allocator = grid.BeginAllocation(itemAllocator);
    FillNeiItemsWith(allocator, search, Repository.current.fluids, Fluid);
    FillNeiItemsWith(allocator, search, Repository.current.items, Item);
}

function FillNeiItemsWith<T extends Goods>(grid:NeiGridAllocator<Goods>, search: SearchQuery | null, arr:Int32Array, proto:IMemMappedObjectPrototype<T>):void
{
    var len = arr.length;
    for (var i=0; i<len; i++) {
        var element = repository.GetObjectIfMatchingSearch(search, arr[i], proto);
        if (element !== null)
            grid.Add(element);
    }
}

var FillNeiAllRecipes:NeiFiller = function(grid:NeiGrid, search : SearchQuery | null, recipes:NeiRecipeMap)
{
    for (const recipeType of allRecipeTypes) {
        var list = recipes[recipeType.name];
        if (list.length >= 0) {
            let allocator = grid.BeginAllocation(recipeType)
            for (let i=0; i<list.length; i++)
                allocator.Add(list[i]);
        }
    }
}

function FillNeiSpecificRecipes(recipeType:RecipeType) : NeiFiller
{
    return function(grid:NeiGrid, search : SearchQuery | null, recipes:NeiRecipeMap)
    {
        var list = recipes[recipeType.name];
        let allocator = grid.BeginAllocation(recipeType)
        for (let i=0; i<list.length; i++)
            allocator.Add(list[i]);
    }
}

function SearchChanged()
{
    search = searchBox.value === "" ? null : new SearchQuery(searchBox.value);
    if (search !== null && search.words.length === 0)
        search = null;
    RefreshNeiContents();
}

type NeiRecipeMap = {[type:string]: Recipe[]};
const mapRecipeTypeToRecipeList:NeiRecipeMap = {};
let allRecipeTypes:RecipeType[];
let filler:NeiFiller = FillNeiAllItems;
let search:SearchQuery | null = null;

{
    let allRecipeTypePointers = repository.recipeTypes;
    allRecipeTypes = new Array(allRecipeTypePointers.length);
    for (var i=0; i<allRecipeTypePointers.length; i++)
    {
        var recipeType = repository.GetObject(allRecipeTypePointers[i], RecipeType);
        mapRecipeTypeToRecipeList[recipeType.name] = [];
        allRecipeTypes[i] = recipeType;
    }
}

export enum ShowNeiMode
{
    Production, Consumption
}

export function ShowNei(goods:Goods | null, mode:ShowNeiMode)
{
    nei.style.display = "block";
    var pointerList = goods == null ? [] : mode == ShowNeiMode.Production ? goods.production : goods.consumption;
    for (var i=0; i<pointerList.length; i++) {
        var recipe = repository.GetObject(pointerList[i], Recipe);
        var recipeType = recipe.recipeType;
        var list:Recipe[] = (mapRecipeTypeToRecipeList[recipeType.name] ??= []);
        list.push(recipe);
    }

    filler = goods === null ? FillNeiAllItems : FillNeiAllRecipes;
    Resize();
}

type NeiGridContents = Recipe | Goods;

interface NeiRowAllocator<T extends NeiGridContents>
{
    CalculateWidth():number;
    CalculateHeight(obj:T):number;
}

class NeiGridRow
{
    y:number = 0;
    height:number = 1;
    elementWidth:number = 1;
    elements:NeiGridContents[] = [];
    allocator:NeiRowAllocator<any> | null = null;

    Clear(y:number, allocator:NeiRowAllocator<any> | null, elementWidth:number)
    {
        this.allocator = allocator;
        this.y = y;
        this.height = 1;
        this.elementWidth = elementWidth;
        this.elements.length = 0;
    }

    Add(element:NeiGridContents, height:number)
    {
        this.elements.push(element);
        if (height > this.height)
            this.height = height;
    }
}

interface NeiGridAllocator<T extends NeiGridContents>
{
    Add(element:T):void;
}

class NeiGrid
{
    rows:NeiGridRow[] = [];
    rowCount:number = 0;
    width:number = 1;
    height:number = 0;
    allocator:NeiRowAllocator<NeiGridContents> | null = null;
    currentRow:NeiGridRow | null = null;
    elementWidth:number = 1;
    elementsPerRow:number = 1;

    Clear(width:number)
    {
        this.rowCount = 0;
        this.width = width;
        this.height = 0;
        this.currentRow = null;
        this.allocator = null;
        this.elementWidth = 1;
        this.elementsPerRow = 1;
    }

    BeginAllocation<T extends NeiGridContents>(allocator: NeiRowAllocator<T>):NeiGridAllocator<T>
    {
        this.FinishRow();
        this.allocator = allocator;
        this.elementWidth = allocator.CalculateWidth();
        this.elementsPerRow = Math.max(1, Math.trunc(this.width/this.elementWidth));
        this.elementWidth = this.width / this.elementsPerRow;
        return this;
    }

    FinishRow()
    {
        if (this.currentRow === null)
            return;
        this.height = this.currentRow.y + this.currentRow.height;
        this.currentRow = null;
    }

    private NextRow():NeiGridRow
    {
        this.FinishRow();
        var row = this.rows[this.rowCount];
        if (row === undefined)
            this.rows[this.rowCount] = row = new NeiGridRow();
        row.Clear(this.height, this.allocator, this.elementWidth);
        this.currentRow = row;
        this.rowCount++;
        return row;
    }

    Add<T extends NeiGridContents>(element:T)
    {
        var row = this.currentRow;
        if (row === null || row.elements.length >= this.elementsPerRow)
            row = this.NextRow();
        row.elements.push(element);
    }
}

function Resize()
{
    var newUnitWidth = Math.round((window.innerWidth - 120 - scrollWidth) / elementSize);
    var newUnitHeight = Math.round((window.innerHeight - 160) / elementSize);
    if (newUnitWidth !== unitWidth || newUnitHeight !== unitHeight)
    {
        unitWidth = newUnitWidth;
        unitHeight = newUnitHeight;
        neiScrollBox.style.width = `${unitWidth * elementSize + scrollWidth}px`;
        neiScrollBox.style.height = `${unitHeight * elementSize}px`;
    }
    RefreshNeiContents();
}

let grid = new NeiGrid();
function RefreshNeiContents()
{
    grid.Clear(unitWidth);
    filler(grid, search, mapRecipeTypeToRecipeList);
    grid.FinishRow();
    neiContent.style.minHeight = `${grid.height*elementSize}px`
    UpdateVisibleItems();
}

function UpdateVisibleItems()
{
    neiContent.innerHTML = "";
    var top = Math.floor(neiScrollBox.scrollTop/elementSize);
    var bottom = top + unitHeight + 1;
    for (var i=0; i<grid.rowCount; i++) {
        var row = grid.rows[i];
        if (row.y > bottom || row.y + row.height <= top)
            continue;
        FillDomWithGridRow(row);
    }
}

function FillDomWithGridRow(row: NeiGridRow)
{
    let rawLeft = 0;
    let left = 0;
    for (var i=0; i<row.elements.length; i++) {
        let rawRight = rawLeft + row.elementWidth;
        let right = Math.round(rawRight);
        AddDomElement(left, row.y, right-left, row.height, row.elements[i]);
        left = right;
        rawLeft = rawRight;
    }
}

function AddDomElement(x:number, y:number, width:number, height:number, element:NeiGridContents)
{
    let addedElement:HTMLElement;
    if (element instanceof Goods) {
        let itemBox = document.createElement("icon-box") as IconBox;
        itemBox.SetGoods(element);
        addedElement = itemBox;
    } else {
        let recipeBox = document.createElement("recipe-box") as RecipeBox;
        recipeBox.SetRecipe(element);
        addedElement = recipeBox;
    }
    let style = addedElement.style;
    style.position = "absolute";
    style.left = `${x*elementSize}px`;
    style.top = `${y*elementSize}px`;
    style.width = `${width*elementSize}px`;
    style.height = `${height*elementSize}px`;
    neiContent.append(addedElement);
}