import { Repository, Goods, Item, Fluid, OreDict, RecipeObject } from "./repository.js";
import { NeiSelect, ShowNei, ShowNeiContext, ShowNeiMode } from "./nei.js";
import { ShowTooltip, HideTooltip, IsHovered } from "./tooltip.js";

// Global cycling state
let globalIndex = 0;
let oredictElements: IconBox[] = [];

// Global actions map
export const actions: { [key: string]: string } = {
    "item_icon_click": "Left/Right click to add recipe",
    "select": "Click to select",
    "toggle_link_ignore": "Click to toggle link ignore",
    "crafter_click": "Click to select another crafter"
};

// Start global cycle once
window.setInterval(() => {
    globalIndex++;
    for (const element of oredictElements) {
        element.UpdateIconId();
    }
}, 500);

export class IconBox extends HTMLElement
{
    public obj:RecipeObject | null = null;

    constructor()
    {
        super();
        const highlightStyle = document.getElementById('item-icon-highlight-style') as HTMLStyleElement;
        
        this.addEventListener("mouseenter", () => {
            const obj = this.GetDisplayObject();
            if (obj) {
                const actionType = this.getAttribute('data-action');
                const actionText = actionType ? actions[actionType] : undefined;
                ShowTooltip(this, {
                    goods: obj,
                    action: actionText ?? "Left/Right click to view Production/Consumption for this item"
                });
                
                // Update highlight style
                const currentIconId = this.style.getPropertyValue('--icon-id');
                if (currentIconId) {
                    highlightStyle.textContent = `
                        item-icon[style*="--icon-id: ${currentIconId}"] {
                            box-shadow: 0 0 0 2px #4CAF50;
                            background-color: #4CAF5020;
                        }
                    `;
                }
            }
        });
        
        this.addEventListener("mouseleave", () => {
            // Clear highlight style
            highlightStyle.textContent = '';
        });
        
        this.addEventListener('contextmenu', this.RightClick);
        this.addEventListener('click', this.LeftClick);
        this.UpdateIconId();
    }

    private StartOredictCycle(oredict: OreDict) {
        if (!oredict || oredict.items.length === 0) return;
        
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
                ShowTooltip(this, { goods: obj });
            }
        }
    }

    static get observedAttributes() {
        return ['data-id'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-id') {
            this.StopOredictCycle();
            this.obj = Repository.current.GetById<RecipeObject>(newValue);
            if (this.obj instanceof OreDict) {
                this.StartOredictCycle(this.obj);
            } else {
                this.UpdateIconId();
            }
        }
    }

    GetDisplayObject():Goods | null
    {
        if (this.obj instanceof Goods) {
            return this.obj;
        }

        if (this.obj instanceof OreDict) {
            return this.obj.items[globalIndex % this.obj.items.length];
        }

        return null;
    }

    disconnectedCallback()
    {
        this.StopOredictCycle();
        HideTooltip(this);
    }

    private CustomAction():string | null
    {
        return this.getAttribute('data-action');
    }

    RightClick(event:any)
    {
        if (this.CustomAction())
            return;
        if (event.ctrlKey || event.metaKey)
            return;
        event.preventDefault();
        ShowNei(this.obj, ShowNeiMode.Consumption, null);
    }

    LeftClick()
    {
        let action = this.CustomAction();
        if (action === "select")
            NeiSelect(this.GetDisplayObject() as Goods);
        if (action)
            return;
        ShowNei(this.obj, ShowNeiMode.Production, null);
    }
}

customElements.define("item-icon", IconBox);
console.log("Registered custom element: item-icon");