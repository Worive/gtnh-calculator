const IntMax = 4294967295;

class Repository
{
    elements: Uint32Array;

    raw: Uint8Array;
    strings: (string | undefined)[];
    slices: (Uint32Array | undefined)[];
    objects: (object | undefined)[];
    textReader: TextDecoder;
    slicesOffset: number;
    objectsOffset: number;

    constructor(data: Uint8Array)
    {
        this.raw = data;
        this.elements = new Uint32Array(data.buffer);
        this.textReader = new TextDecoder();
        var version = this.elements[0];
        var stringCount = this.elements[1];
        var slicesCount = this.elements[2];
        var objectCount = this.elements[3];
        this.strings = new Array(stringCount);
        this.slices = new Array(slicesCount);
        this.objects = new Array(objectCount);
        this.slicesOffset = stringCount * 2 + 4;
        this.objectsOffset = this.slicesOffset + slicesCount * 2;
    }

    GetString(offset:number):string
    {
        var id = this.elements[offset];
        return this.strings[id] ?? (this.strings[id] = this.ReadString(id))
    }

    private ReadString(id:number):string
    {
        var begin = this.raw[id*2+4];
        var end = this.raw[id*2+5];
        return this.textReader.decode(this.raw.subarray(begin, end))
    }

    GetSlice(offset:number):Uint32Array
    {
        var id = this.elements[offset];
        return this.slices[id] ?? (this.slices[id] = this.ReadSlice(id))
        
    }

    private ReadSlice(id:number):Uint32Array
    {
        var begin = this.raw[id*2+this.slicesOffset];
        var end = this.raw[id*2+this.slicesOffset+1];
        return this.elements.subarray(begin, end);
    }

    GetObject<T extends MemMappedObject>(offset:number, prototype: IMemMappedObjectPrototype<T>):T
    {
        var id = this.elements[offset];
        if (id === IntMax)
            return null as unknown as T;
        return (this.objects[id] as T) ?? (this.objects[id] = this.ReadObject<T>(id, prototype))
    }

    private ReadObject<T extends MemMappedObject>(id:number, prototype:IMemMappedObjectPrototype<T>):T
    {
        var objectOffset = this.elements[id + this.objectsOffset];
        return new prototype(this, objectOffset);
    }
}

interface IMemMappedObjectPrototype<T extends MemMappedObject>
{
    new(repository:Repository, offset:number):T
}

class MemMappedObject
{
    repository:Repository;
    objectOffset:number

    constructor(repository:Repository, offset:number)
    {
        this.repository = repository;
        this.objectOffset = offset;
    }

    protected GetInt(offset:number)
    {
        return this.repository.elements[offset + this.objectOffset];
    }

    protected GetString(offset:number)
    {
        return this.repository.GetString(offset + this.objectOffset);
    }

    protected GetSlice(offset:number)
    {
        return this.repository.GetSlice(offset + this.objectOffset);
    }

    protected GetObject<T extends MemMappedObject>(offset:number, prototype:IMemMappedObjectPrototype<T>)
    {
        return this.repository.GetObject<T>(offset + this.objectOffset, prototype);
    }
}

class RecipeObject extends MemMappedObject
{
    get name():string {return this.GetString(0);}
}

class Goods extends RecipeObject
{
    get id(): string {return this.GetString(1);}
    get mod(): string {return this.GetString(2);}
    get internalName(): string {return this.GetString(3);}
    get numericId(): number {return this.GetInt(4);}
    get iconId(): number {return this.GetInt(5);}
    get tooltip(): string {return this.GetString(6);}
    get unlocalizedName(): string {return this.GetString(7);}
    get nbt(): string {return this.GetString(8);}
    get production(): Uint32Array {return this.GetSlice(9);}
    get consumption(): Uint32Array {return this.GetSlice(10);}
}

class Item extends Goods
{
    get stackSize():number {return this.GetInt(11);}
    get damage():number {return this.GetInt(12);}
    get fluid():Fluid | null {return this.GetObject(13, Fluid);}
    get fluidAmount():number {return this.GetInt(14);}
}

class Fluid extends Goods
{
    get isGas():boolean {return this.GetInt(11) === 1;}
    get containers():Uint32Array {return this.GetSlice(12);}
}

class OreDict extends RecipeObject
{
    get items():Uint32Array {return this.GetSlice(1);}
}

class RecipeType extends MemMappedObject
{
    get name():string {return this.GetString(0);}
    get index():number {return this.GetInt(1);}
    get category():string {return this.GetString(2);}
    get dimensions():Uint32Array {return this.GetSlice(3);}
    get craftItems():Uint32Array {return this.GetSlice(4);}
    get shapeless():boolean {return this.GetInt(5) === 1;}
}

class GtRecipe extends MemMappedObject
{
    get voltage():number {return this.GetInt(0);}
    get durationTicks():number {return this.GetInt(1);}
    get durationSeconds():number {return this.GetInt(1) / 20;}
    get amperage():number {return this.GetInt(2);}
    get voltageTier():number {return this.GetInt(3);}
    get cleanRoom():boolean {return (this.GetInt(4) & 1) === 1;}
    get lowGravity():boolean {return (this.GetInt(4) & 2) === 1;}
    get additionalInfo():string {return this.GetString(5);}
}

enum RecipeIoType
{
    ItemInput = 0,
    OreDictInput,
    FluidInput,
    ItemOutput,
    FluidOutput
}

type RecipeInOut =
{
    type: RecipeIoType;
    goods: RecipeObject;
    slot: number;
    amount: number;
    probability: number;
}

class Recipe extends MemMappedObject
{
    get recipeType():RecipeType {return this.GetObject(1, RecipeType) as RecipeType;}
    get gtRecipe():GtRecipe {return this.GetObject(2, GtRecipe)}
    private computedIo:RecipeInOut[] | undefined;

    get items():RecipeInOut[] { return this.computedIo ?? (this.computedIo == this.ComputeItems());}

    private ComputeItems():RecipeInOut[]
    {
        var slice = this.GetSlice(0);
        var elements = slice.length / 5;
        var result:RecipeInOut[] = new Array(elements);
        var index = 0;
        for(var i=0; i<elements; i++) {

        }
        return result;
    }
}