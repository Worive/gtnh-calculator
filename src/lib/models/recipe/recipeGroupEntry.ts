import { ModelObject } from '$lib/models/base/modelObject';
import { FlowInformation } from '$lib/models/flow/flowInformation';

const emptyFlow: FlowInformation = new FlowInformation();

export abstract class RecipeGroupEntry extends ModelObject {
	flow: FlowInformation = emptyFlow;
}
