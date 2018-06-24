import R from 'ramda';
import {handleStandardAdd, handleStandardRemove, handleStandardReceive, createReducer} from './../../utils';
import constants from './generatedWorldsConstants';

const initialState = {
	generatedWorldsById: {},
	generatedWorlds: [],
	pendingGeneratedWorldsById: {},
	pendingGeneratedWorlds: [],
	erroredGeneratedWorldsById: {},
	erroredGeneratedWorlds: [],
	worldSitesAndPopsById: {},
	worldSitesAndPops: []
};

const generatedResourceName = 'generatedWorlds';
const pendingResourceName = 'pendingGeneratedWorlds';
const erroredResourceName = 'erroredGeneratedWorlds';
const worldSitesAndPopsResourceName = 'worldSitesAndPops';

const createErroredGeneratedWorld = ({generatedWorld, ...error}) => ({...generatedWorld, error});
const handleGeneratedWorldError = R.curry((action, state) => {
	const {payload, error} = action;
	if (!error) return state;

	const erroredGeneratedWorld = createErroredGeneratedWorld(payload);
	const {id} = erroredGeneratedWorld;
	return R.evovle({
		[erroredResourceName]: R.compose(R.uniq, R.append(id)),
		[`${erroredResourceName}ById`]: R.flip(R.merge)({[id]: erroredGeneratedWorld})
	})(state);
});

const createWorldSitesAndPropsResource = ({worldSitesAndProps, ...generatedWorld}) => ({
	...worldSitesAndProps,
	id: generatedWorld.id,
	generatedWorldId: generatedWorld.id
});

export default createReducer(initialState, [
	[constants.CREATE_GENERATED_WORLD, handleGeneratedWorldError],
	[constants.CREATE_GENERATED_WORLD_DONE, [
		handleStandardAdd({
			resourceName: generatedResourceName,
			payloadSelector: R.omit(['worldSitesAndPops'])
		}),
		handleStandardRemove({
			resourceName: pendingResourceName
		}),
		handleStandardAdd({
			resourceName: worldSitesAndPopsResourceName,
			payloadSelector: createWorldSitesAndPropsResource
		}),
		handleGeneratedWorldError
	]],
	[constants.REMOVE_GENERATED_WORLD, handleStandardRemove({
		resourceName: generatedResourceName
	})],
	[constants.RECEIVE_GENERATED_WORLDS, handleStandardReceive({
		resourceName: generatedResourceName,
		payloadSelector: R.prop('generatedWorlds')
	})],
	[constants.GENERATE_WORLD, handleStandardAdd({
		resourceName: pendingResourceName
	})],
	[constants.REMOVE_PENDING_GENERATED_WORLD, handleStandardRemove({
		resourceName: pendingResourceName
	})],
	[constants.ADD_ERRORED_GENERATED_WORLD, handleStandardAdd({
		resourceName: erroredResourceName,
		payloadSelector: R.prop('erroredGeneratedWorld')
	})],
	[constants.REMOVE_ERRORED_GENERATED_WORLD, handleStandardRemove({
		resourceName: erroredResourceName
	})],
	[constants.RECEIVE_WORLD_SITES_AND_POPS, handleStandardReceive({
		resourceName: worldSitesAndPopsResourceName,
		payloadSelector: R.prop('allWorldSitesAndPops')
	})],
	[constants.ADD_WORLD_SITES_AND_POPS, handleStandardAdd({
		resourceName: worldSitesAndPopsResourceName,
		payloadSelector: R.prop('worldSitesAndPops')
	})]
]);
