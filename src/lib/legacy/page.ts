import { ModelObjectSerializer } from '$lib/models/base/modelObjectSerializer';
import { ModelObjectIidScanner } from '$lib/models/base/modelObjectIidScanner';
import type { iidScanResult } from '$lib/types/core/iidScanResult';
import { RecipeGroupModel } from '$lib/models/recipe/recipeGroupModel';
import { RecipeGroupEntry } from '$lib/models/recipe/recipeGroupEntry';
import type { PageModel } from '$lib/models/page/pageModel';
import { CalculatorEngine } from '$lib/core/solver/calculatorEngine';
import { currentPageStore } from '$lib/stores/currentPage.store';
import { get } from 'svelte/store';
import { SearchQuery } from '$lib/models/search/searchQuery';
import { RecipeModel } from '$lib/models/recipe/recipeModel';

let nextIid = 0;

let serializer = new ModelObjectSerializer();
export { serializer };
let iidScanner = new ModelObjectIidScanner();

export function GetByIid(iid: number): iidScanResult {
	const page = get(currentPageStore);

	return iidScanner.Scan(page, page, iid);
}

export function DragAndDrop(sourceIid: number, targetIid: number) {
	if (sourceIid === targetIid) return;

	var draggingObject = GetByIid(sourceIid);
	if (
		draggingObject === null ||
		!(draggingObject.parent instanceof RecipeGroupModel) ||
		!(draggingObject.current instanceof RecipeGroupEntry)
	)
		return;
	var targetObject = GetByIid(targetIid);
	if (targetObject === null || !(targetObject.current instanceof RecipeGroupEntry)) return;
	if (draggingObject.current instanceof RecipeGroupModel && !draggingObject.current.collapsed)
		return;
	console.log('DragAndDrop', draggingObject, targetObject);
	let success = false;

	if (targetObject.current instanceof RecipeGroupModel && !targetObject.current.collapsed) {
		draggingObject.parent.elements.splice(
			draggingObject.parent.elements.indexOf(draggingObject.current),
			1
		);
		targetObject.current.elements.push(draggingObject.current);
		success = true;
	} else if (targetObject.parent instanceof RecipeGroupModel) {
		draggingObject.parent.elements.splice(
			draggingObject.parent.elements.indexOf(draggingObject.current),
			1
		);
		var index = targetObject.parent.elements.indexOf(targetObject.current);
		if (index === -1) return;
		targetObject.parent.elements.splice(index, 0, draggingObject.current);
		success = true;
	}
	if (success) {
		UpdateProject();
	}
}

const changeListeners: ProjectChangeListener[] = [];

// Event system
type ProjectChangeListener = () => void;

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
	changeListeners.forEach((listener) => listener());
}

export function SetCurrentPage(newPage: PageModel) {
	console.log('SetCurrentPage', newPage);
	currentPageStore.set(newPage);
	UpdateProject();
}

export function UpdateProject(visualOnly: boolean = false) {
	if (!visualOnly) {
		CalculatorEngine.solvePage(get(currentPageStore));
	}
	notifyListeners();
}

async function GetUrlHashFromJson(json: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(json);
	const compressedStream = new CompressionStream('deflate');
	const writer = compressedStream.writable.getWriter();
	writer.write(data);
	writer.close();
	const compressedBytes = await new Response(compressedStream.readable).arrayBuffer();
	const compressed = String.fromCharCode(...new Uint8Array(compressedBytes));
	const base64 = btoa(compressed).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	return base64;
}

export async function CopyCurrentPageUrl() {
	const serialized = serializer.Serialize(get(currentPageStore));
	const jsonString = JSON.stringify(serialized);
	const hash = await GetUrlHashFromJson(jsonString);
	const url = `${window.location.origin}${window.location.pathname}#${hash}`;
	await navigator.clipboard.writeText(url);
}

export function DownloadCurrentPage() {
	const serialized = serializer.Serialize(get(currentPageStore));
	const prettyJson = JSON.stringify(serialized, null, 2);
	const blob = new Blob([prettyJson], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${get(currentPageStore).name}.gtnh`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function SearchGroup(
	query: SearchQuery,
	group: RecipeGroupModel,
	idMap: { [key: string]: boolean }
) {
	for (let element of group.elements) {
		if (element instanceof RecipeGroupModel) {
			SearchGroup(query, element, idMap);
		} else if (element instanceof RecipeModel) {
			if (!element.recipe) continue;
			for (let item of element.recipe.items) {
				if (item.goods.id in idMap) continue;
				idMap[item.goods.id] = item.goods.MatchSearchText(query);
			}
		}
	}
}

export function Search(text: string): { [key: string]: boolean } {
	const page = get(currentPageStore);

	let result: { [key: string]: boolean } = {};
	let query = new SearchQuery(text);
	SearchGroup(query, page.rootGroup, result);
	return result;
}
