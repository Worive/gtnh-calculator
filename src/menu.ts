import { PageModel, loadPage, serializer } from './page.js';

export class PageManager {
    private pages: string[] = [];
    private currentPage: string | null = null;
    private pageListContainer: HTMLElement;

    constructor() {
        this.pageListContainer = document.querySelector('.page-list')!;
        this.loadPagesFromStorage();
        this.render();
        this.loadFirstPage();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.pageListContainer.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.matches('[data-action="switch-page"]')) {
                const pageName = target.dataset.pageName;
                if (pageName) this.switchPage(pageName);
            }
        });

        this.pageListContainer.addEventListener('click', () => {
            const input = document.querySelector('[data-action="page-name-input"]') as HTMLInputElement;
            if (input && input.value.trim()) {
                this.createNewPage(input.value.trim());
                input.value = '';
            }
        });
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
        this.pageListContainer.innerHTML = this.pages.map(pageName => `
            <button class="page-button ${pageName === this.currentPage ? 'active' : ''}"
                    data-action="switch-page"
                    data-page-name="${pageName}">
                ${pageName}
            </button>
        `).join('');
    }

    private loadFirstPage() {
        if (this.pages.length > 0) {
            this.switchPage(this.pages[0]);
        } else {
            this.createNewPage('New');
        }
    }

    private switchPage(pageName: string) {
        if (this.currentPage === pageName) return;
        
        this.currentPage = pageName;
        loadPage(`p:${pageName}`);
        this.render();
    }

    private createNewPage(pageName: string) {
        let finalName = pageName;
        let counter = 1;
        while (this.pages.includes(finalName)) {
            finalName = `${pageName} ${counter}`;
            counter++;
        }
        
        const page = new PageModel();
        page.name = finalName;
        localStorage.setItem(`p:${finalName}`, JSON.stringify(serializer.Serialize(page)));
        
        this.pages.push(finalName);
        this.pages.sort();
        this.switchPage(finalName);
        this.render();
    }
}

new PageManager();
