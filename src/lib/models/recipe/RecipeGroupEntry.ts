import { ModelObject } from '$lib/models/base/ModelObject';
import { FlowInformation } from '$lib/models/flow/FlowInformation';

const emptyFlow: FlowInformation = new FlowInformation();

export abstract class RecipeGroupEntry extends ModelObject {
	flow: FlowInformation = emptyFlow;
}
