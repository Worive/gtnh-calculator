import { Goods } from "../data/repository.js";
import { ShowNei, ShowNeiMode } from "./nei.js";
import { ShowTooltip, HideTooltip } from "./tooltip.js";

export class IconBox extends HTMLElement
{
    goods:Goods | null = null;
    icon:HTMLElement | undefined;

    constructor()
    {
        super();
        this.addEventListener("mouseenter", () => ShowTooltip(this, this.goods));
        this.addEventListener("mouseleave", () => HideTooltip(this));
        this.addEventListener('contextmenu', this.RightClick);
        this.addEventListener('click', this.LeftClick);

    }

    connectedCallback()
    {
        this.icon = document.createElement("div");
        this.icon.classList.add("icon");
        this.appendChild(this.icon);
        if (this.goods != null)
            this.SetGoods(this.goods);
    }

    disconnectedCallback()
    {
        HideTooltip(this);
    }

    SetGoods(goods: Goods | null)
    {
        this.goods = goods;
        if (this.icon) {
            if (goods == null) {
                this.icon.style.display = "none";
            } else {
                this.icon.style.display = "block";
                this.icon.style.setProperty("--icon-id", goods.iconId.toString());
            }
        }
    }

    RightClick(event:any)
    {
        if (event.ctrlKey || event.metaKey)
            return;
        event.preventDefault();
        ShowNei(this.goods, ShowNeiMode.Consumption);
    }

    LeftClick()
    {
        ShowNei(this.goods, ShowNeiMode.Production);
    }
}

customElements.define("icon-box", IconBox);
console.log("Registered custom element: icon-box");