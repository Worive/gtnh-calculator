import { Goods, Repository, Item } from "./repository.js";
import { addProjectChangeListener } from "./page.js";

export class Dropdown {
    private static instance: Dropdown;
    private dropdown: HTMLElement;
    private currentTarget: HTMLElement | null = null;
    private currentPopulateCallback: ((container: HTMLElement) => void) | null = null;

    private constructor() {
        this.dropdown = document.getElementById("dropdown")!;
        
        // Hide dropdown when clicking anywhere
        document.addEventListener("click", (e) => {
            if (this.currentTarget) {
                // Ignore clicks on the target element that triggered the dropdown
                // or any of its children
                if (e.target === this.currentTarget || 
                    this.currentTarget.contains(e.target as Node) ||
                    this.dropdown.contains(e.target as Node)) {
                    return;
                }
                
                this.hide();
            }
        });

        // Register a single project change listener
        addProjectChangeListener(() => {
            if (this.isVisible() && this.currentPopulateCallback) {
                this.currentPopulateCallback(this.dropdown);
            }
        });
    }

    public static getInstance(): Dropdown {
        if (!Dropdown.instance) {
            Dropdown.instance = new Dropdown();
        }
        return Dropdown.instance;
    }

    public getDropdownElement(): HTMLElement {
        return this.dropdown;
    }

    public show(target: HTMLElement, populateCallback: (container: HTMLElement) => void): void {
        this.currentTarget = target;
        this.currentPopulateCallback = populateCallback;
        
        // Clear previous content
        this.dropdown.innerHTML = "";
        
        // Call the provided callback to populate the dropdown
        populateCallback(this.dropdown);
        
        this.dropdown.style.display = "block";
        
        // Position the dropdown
        const targetRect = target.getBoundingClientRect();
        const dropdownRect = this.dropdown.getBoundingClientRect();
        
        // Check if there's enough space below
        const spaceBelow = window.innerHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;
        
        if (spaceBelow >= dropdownRect.height || spaceBelow > spaceAbove) {
            // Position below
            this.dropdown.style.top = `${targetRect.bottom}px`;
        } else {
            // Position above
            this.dropdown.style.top = `${targetRect.top - dropdownRect.height}px`;
        }
        
        // Center horizontally relative to target
        this.dropdown.style.left = `${targetRect.left + (targetRect.width - dropdownRect.width) / 2}px`;
    }

    public hide(): void {
        this.currentTarget = null;
        this.currentPopulateCallback = null;
        this.dropdown.style.display = "none";
    }

    public isVisible(): boolean {
        return this.dropdown.style.display === "block";
    }
}

export function ShowDropdown(target: HTMLElement, populateCallback: (container: HTMLElement) => void): void {
    Dropdown.getInstance().show(target, populateCallback);
}

export function HideDropdown(): void {
    Dropdown.getInstance().hide();
}
