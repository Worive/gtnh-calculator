export class RecipeList {
    private panel: HTMLElement;
    private productsGrid: HTMLElement;
    private recipesList: HTMLElement;
    private addButton: HTMLElement;

    constructor() {
        this.panel = document.getElementById('recipe-list')!;
        this.productsGrid = this.panel.querySelector('.products-grid')!;
        this.recipesList = this.panel.querySelector('.recipes-list')!;
        this.addButton = this.panel.querySelector('.recipe-list-add')!;

        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.addButton.addEventListener('click', () => this.addNewRecipe());
    }

    public show() {
        this.panel.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    public hide() {
        this.panel.classList.add('hidden');
        document.body.style.overflow = '';
    }

    private addNewRecipe() {
        // TODO: Implement recipe addition logic
        console.log('Add new recipe clicked');
    }
} 