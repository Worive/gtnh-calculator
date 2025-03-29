import { Goods } from "./data/repository";

let nextIid = 0;

export abstract class ModelObjectVisitor
{
    abstract VisitData(key:string, data:any):void;
    abstract VisitObject(key:string, obj:ModelObject):void;
    abstract VisitArray(key:string, array:ModelObject[]):void;
}

class ModelObjectSerializer extends ModelObjectVisitor
{
    stack: object[] = [];
    current: {[key:string]: any} = {};

    VisitData(key: string, data: any): void {
        this.current[key] = data;
    }

    VisitObject(key: string, obj: ModelObject): void {
        this.stack.push(this.current);
        this.current = {};
        obj.Visit(this);
        let result = this.current;
        this.current = this.stack.pop()!;
        this.current[key] = result;
    }

    VisitArray(key: string, array: ModelObject[]): void {
        var arr = [];
        this.stack.push(this.current);
        for (const obj of array) {
            this.current = {};
            obj.Visit(this);
            arr.push(this.current);
        }
        this.current = this.stack.pop()!;
        this.current[key] = arr;
    }

    Serialize(obj:ModelObject):any
    {
        this.current = {};
        obj.Visit(this);
        return this.current;
    }
}

class ModelObjectIidScanner extends ModelObjectVisitor
{
    iid:number = 0;
    result:ModelObject | null = null;
    VisitData(key: string, data: any): void {}
    VisitObject(key: string, obj: ModelObject): void {
        if (obj.iid === this.iid) {
            this.result = obj;
        }
        obj.Visit(this);
    }
    VisitArray(key: string, array: ModelObject[]): void {
        for (const obj of array) {
            this.VisitObject(key, obj);
        }
    }

    Scan(obj:ModelObject):ModelObject | null
    {
        this.iid = obj.iid;
        obj.Visit(this);
        return this.result;
    }
}

export let serializer = new ModelObjectSerializer();
export let iidScanner = new ModelObjectIidScanner();

export abstract class ModelObject
{
    iid:number;
    abstract Visit(visitor:ModelObjectVisitor):void;

    protected IidScan(data:ModelObject[] | ModelObject, iid:number):ModelObject | null
    {
        if (data instanceof Array) {
            for (const obj of data) {
                let result = this.IidScan(obj, iid);
                if (result) return result;
            }
            return null;
        } else {
            if (data.iid === iid) return data;
            return data.IidScan(data, iid);
        }
    }

    constructor()
    {
        this.iid = nextIid++;
    }
}

export class ProjectModel extends ModelObject
{
    pages: PageModel[];
    Visit(visitor: ModelObjectVisitor): void {
        visitor.VisitArray("pages", this.pages);
    }

    constructor(source:any = undefined)
    {
        super();
        if (source instanceof Object) {
            if (source.pages instanceof Array)
                this.pages = source.pages.map((page: any) => new PageModel(page));
            else this.pages = [new PageModel()];
        } else this.pages = [new PageModel()];
    }
}

export class PageModel extends ModelObject
{
    name: string = "New Page";
    Visit(visitor: ModelObjectVisitor): void {
        visitor.VisitData("name", this.name);
    }

    constructor(source:any = undefined)
    {
        super();
        if (source instanceof Object) {
            if (source.name instanceof String)
                this.name = source.name;
        }
    }
}

export abstract class RecipeGroupEntry extends ModelObject
{
}

export class RecipeGroupModel extends RecipeGroupEntry
{
    links: string[] = [];
    elements: RecipeGroupEntry[] = [];

    Visit(visitor: ModelObjectVisitor): void {
        visitor.VisitData("type", "recipe_group");
        visitor.VisitData("links", this.links);
        visitor.VisitArray("elements", this.elements);
    }
}

export class RecipeModel extends RecipeGroupEntry
{
    public recipeId: string = "";
    Visit(visitor: ModelObjectVisitor): void {
        visitor.VisitData("type", "recipe");
        visitor.VisitData("recipeId", this.recipeId);
    }

    constructor(source:any = undefined)
    {
        super();
        if (source instanceof Object) {
            if (source.recipeId instanceof String)
                this.recipeId = source.recipeId;
        }
    }
}

const STORAGE_KEY = "gtnh_calculator_project";
const MAX_HISTORY = 50;

export var project: ProjectModel = new ProjectModel();
export var page: PageModel = project.pages[0];

// Undo history
let history: string[] = [];

// Event system
type ProjectChangeListener = () => void;
const changeListeners: ProjectChangeListener[] = [];

export function addProjectChangeListener(listener: ProjectChangeListener) {
    changeListeners.push(listener);
}

export function removeProjectChangeListener(listener: ProjectChangeListener) {
    const index = changeListeners.indexOf(listener);
    if (index > -1) {
        changeListeners.splice(index, 1);
    }
}

function notifyListeners() {
    changeListeners.forEach(listener => listener());
}

// Load project from storage
function loadProject() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            let projectData = JSON.parse(stored);
            project = new ProjectModel(projectData);
        } catch (e) {
            console.error("Failed to load project:", e);
        }
    }
}

// Save project to storage
function saveProject() {
    try {
        const json = JSON.stringify(serializer.Serialize(project));
        localStorage.setItem(STORAGE_KEY, json);
        
        // Add to history
        history.push(json);
        if (history.length > MAX_HISTORY) {
            history.shift();
        }
        console.log(json);
    } catch (e) {
        console.error("Failed to save project:", e);
    }
}

export function UpdateProject() {
    saveProject();
    notifyListeners();
}

export function Undo() {
    if (history.length > 1) {
        history.pop(); // Remove current state
        const previousState = history[history.length - 1];
        try {
            project = new ProjectModel(JSON.parse(previousState));
            notifyListeners();
        } catch (e) {
            console.error("Failed to undo:", e);
        }
    }
}

// Load project on startup
loadProject();

// Add keyboard shortcut for undo
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        Undo();
    }
});