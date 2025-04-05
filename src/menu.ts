import { PageModel, loadPage, serializer } from './page.js';

export class PageManager {
    private pages: string[] = [];
    private container: HTMLElement;
    private currentPage: string | null = null;

    constructor(containerId: string) {
        this.container = document.getElementById(containerId)!;
        this.container.classList.add('menu-container');
        this.loadPagesFromStorage();
        this.render();
        this.loadFirstPage();
    }

    private loadPagesFromStorage() {
        this.pages = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)!;
            if (key.startsWith('p:')) {
                console.log("Found page", key);
                this.pages.push(key.substring(2));
            }
        }
        this.pages.sort();
    }

    private render() {
        this.container.innerHTML = '';
        
        // Add page buttons
        this.pages.forEach(pageName => {
            const button = document.createElement('button');
            button.textContent = pageName;
            button.classList.add('page-button');
            if (pageName === this.currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => this.switchPage(pageName));
            this.container.appendChild(button);
        });

        // Add "New Page" button
        const addButton = document.createElement('button');
        addButton.textContent = 'New Page';
        addButton.classList.add('add-page-button');
        addButton.addEventListener('click', () => this.createNewPage());
        this.container.appendChild(addButton);
    }

    private loadFirstPage() {
        if (this.pages.length > 0) {
            this.switchPage(this.pages[0]);
        } else {
            this.createNewPage();
        }
    }

    private switchPage(pageName: string) {
        if (this.currentPage === pageName) return;
        
        this.currentPage = pageName;
        loadPage(`p:${pageName}`);
        this.render();
    }

    private createNewPage() {
        const newPageName = 'New';
        let counter = 1;
        while (this.pages.includes(newPageName + (counter > 1 ? ` ${counter}` : ''))) {
            counter++;
        }
        const finalName = newPageName + (counter > 1 ? ` ${counter}` : '');
        
        const page = new PageModel();
        page.name = finalName;
        localStorage.setItem(`p:${finalName}`, JSON.stringify(serializer.Serialize(page)));
        
        this.pages.push(finalName);
        this.pages.sort();
        this.switchPage(finalName);
        this.render();
    }
}

new PageManager('menu');
