import { ModelObject } from '$lib/core/data/models/ModelObject';
import { ProductModel } from '$lib/core/data/models/ProductModel';
import { RecipeGroupModel } from '$lib/core/data/models/RecipeGroupModel';
import type { ModelObjectVisitor } from '$lib/core/data/models/ModelObjectVisitor';
import type { Settings } from '$lib/types/models/Settings';
import { SolvePage } from '$lib/legacy/solver';

export class PageModel extends ModelObject {
	name: string = 'New Page';
	products: ProductModel[] = [];
	rootGroup: RecipeGroupModel = new RecipeGroupModel();
	private history: string[] = [];
	private readonly MAX_HISTORY = 50;
	status: 'not solved' | 'solved' | 'infeasible' | 'unbounded' = 'not solved';
	settings: Settings = { minVoltage: 0, timeUnit: 'min' };
	timeScale: number = 1;

	Visit(visitor: ModelObjectVisitor): void {
		visitor.VisitData(this, 'name', this.name);
		visitor.VisitArray(this, 'products', this.products);
		visitor.VisitObject(this, 'rootGroup', this.rootGroup);
		visitor.VisitData(this, 'settings', this.settings);
	}

	constructor(source: any = undefined) {
		super();
		this.loadFromObject(source);
	}

	private loadFromObject(source: any) {
		if (source instanceof Object) {
			if (typeof source.name === 'string') this.name = source.name;
			if (source.products instanceof Array)
				this.products = source.products.map((product: any) => new ProductModel(product));
			if (source.rootGroup instanceof Object)
				this.rootGroup = new RecipeGroupModel(source.rootGroup);
			if (source.settings instanceof Object) {
				if (typeof source.settings.minVoltage === 'number')
					this.settings.minVoltage = source.settings.minVoltage;
				if (typeof source.settings.timeUnit === 'string')
					this.settings.timeUnit = source.settings.timeUnit as 'min' | 'sec' | 'tick';
			}
		}
	}

	// Undo history methods
	addToHistory(json: string) {
		this.history.push(json);
		if (this.history.length > this.MAX_HISTORY) {
			this.history.shift();
		}
	}

	undo(): boolean {
		if (this.history.length > 1) {
			this.history.pop(); // Remove current state
			const previousState = this.history[this.history.length - 1];
			try {
				this.loadFromObject(JSON.parse(previousState));
				SolvePage(this);
				return true;
			} catch (e) {
				console.error('Failed to undo:', e);
			}
		}
		return false;
	}

	static deserialize(json: string): PageModel {
		const data = JSON.parse(json);

		if (!(data instanceof Object)) {
			throw new TypeError('Expected object, got ' + data);
		}

		return new PageModel(data);
	}
}
