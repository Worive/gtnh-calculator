import { ModelObject } from '$lib/core/data/models/ModelObject';
import { FlowInformation } from '$lib/core/data/models/FlowInformation';

let emptyFlow: FlowInformation = new FlowInformation();

export abstract class RecipeGroupEntry extends ModelObject {
	flow: FlowInformation = emptyFlow;
}
