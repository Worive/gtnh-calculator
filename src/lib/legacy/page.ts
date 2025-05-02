import { ModelObjectSerializer } from '$lib/core/data/models/ModelObjectSerializer';
import { ModelObjectIidScanner } from '$lib/core/data/models/ModelObjectIidScanner';
import type { iidScanResult } from '$lib/types/iidScanResult';
import { RecipeGroupModel } from '$lib/core/data/models/RecipeGroupModel';
import { RecipeGroupEntry } from '$lib/core/data/models/RecipeGroupEntry';
import type { PageModel } from '$lib/core/data/models/PageModel';
import { CalculatorEngine } from '$lib/core/solver/CalculatorEngine';
import { currentPageStore } from '$lib/stores/currentPage.store';
import { get } from 'svelte/store';

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
	if (
		targetObject === null ||
		!(targetObject.parent instanceof RecipeGroupModel) ||
		!(targetObject.current instanceof RecipeGroupEntry)
	)
		return;
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
