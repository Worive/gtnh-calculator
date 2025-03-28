import { Repository, Goods, Item, Fluid, OreDict } from "../data/repository.js";
import { ShowNei, ShowNeiMode } from "./nei.js";
import { ShowTooltip, HideTooltip, IsHovered } from "./tooltip.js";

// Global cycling state
let globalIndex = 0;
let oredictElements: IconBox[] = [];

// Start global cycle once
window.setInterval(() => {
    globalIndex++;
    for (const element of oredictElements) {
        element.UpdateIconId();
    }
}, 500);

export class IconBox extends HTMLElement
{
    private oredict: OreDict | null = null;

    constructor()
    {
        super();
        this.addEventListener("mouseenter", () => ShowTooltip(this, this.GetDisplayObject()));
        this.addEventListener("mouseleave", () => HideTooltip(this));
        this.addEventListener('contextmenu', this.RightClick);
        this.addEventListener('click', this.LeftClick);
        this.UpdateIconId();
    }

    private StartOredictCycle() {
        const dataObj = this.getAttribute("data-obj");
        if (!dataObj) return;
        
        // Get oredict
        this.oredict = Repository.current.GetObject(Number.parseFloat(dataObj), OreDict);
        if (!this.oredict || this.oredict.items.length === 0) return;
        
        this.UpdateIconId();
        
        // Add to global cycle if not already there
        if (!oredictElements.includes(this)) {
            oredictElements.push(this);
        }
    }

    private StopOredictCycle() {
        const index = oredictElements.indexOf(this);
        if (index > -1) {
            oredictElements.splice(index, 1);
        }
    }

    UpdateIconId() {
        const obj = this.GetDisplayObject();
        if (obj) {
            this.style.setProperty('--icon-id', obj.iconId.toString());
            
            // Update tooltip if this element is currently being hovered
            if (IsHovered(this)) {
                ShowTooltip(this, obj);
            }
        }
    }

    static get observedAttributes() {
        return ['data-obj', 'data-type'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-obj' || name === 'data-type') {
            this.StopOredictCycle();
            if (this.getAttribute('data-type') === 'oredict') {
                this.StartOredictCycle();
            } else {
                this.UpdateIconId();
            }
        }
    }

    GetDisplayObject():Goods | null
    {
        var dataObj = this.getAttribute("data-obj");
        var dataType = this.getAttribute("data-type");
        if (dataObj === null || dataType === null)
            return null;
        var ptr = Number.parseFloat(dataObj);
        if (ptr === 0)
            return null;

        if (dataType === "oredict") {
            if (!this.oredict) {
                this.StartOredictCycle();
            }
            if (!this.oredict) return null;
            return Repository.current.GetObject(this.oredict.items[globalIndex % this.oredict.items.length], Item);
        }

        return dataType === "fluid" ? Repository.current.GetObject(ptr, Fluid) : Repository.current.GetObject(ptr, Item);
    }

    disconnectedCallback()
    {
        this.StopOredictCycle();
        HideTooltip(this);
    }

    RightClick(event:any)
    {
        if (event.ctrlKey || event.metaKey)
            return;
        event.preventDefault();
        ShowNei(this.GetDisplayObject(), ShowNeiMode.Consumption);
    }

    LeftClick()
    {
        ShowNei(this.GetDisplayObject(), ShowNeiMode.Production);
    }
}

customElements.define("item-icon", IconBox);
console.log("Registered custom element: item-icon");