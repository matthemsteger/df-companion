import {
	evolve,
	curry,
	prop,
	omit,
	compose,
	uniq,
	append,
	flip,
	merge
} from 'ramda';
import {
	handleStandardAdd,
	handleStandardRemove,
	handleStandardReceive,
	createReducer
} from '@matthemsteger/redux-utils-fn-reducers';
import constants from './constants';

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

const createErroredGeneratedWorld = ({generatedWorld, ...error}) => ({
	...generatedWorld,
	error
});
const handleGeneratedWorldError = curry((action, state) => {
	const {payload, error} = action;
	if (!error) return state;

	const erroredGeneratedWorld = createErroredGeneratedWorld(payload);
	const {id} = erroredGeneratedWorld;
	return evolve({
		[erroredResourceName]: compose(
			uniq,
			append(id)
		),
		[`${erroredResourceName}ById`]: flip(merge)({
			[id]: erroredGeneratedWorld
		})
	})(state);
});

const createWorldSitesAndPropsResource = ({
	worldSitesAndProps,
	...generatedWorld
}) => ({
	...worldSitesAndProps,
	id: generatedWorld.id,
	generatedWorldId: generatedWorld.id
});

export default createReducer(initialState, [
	[constants.CREATE_GENERATED_WORLD, handleGeneratedWorldError],
	[
		constants.CREATE_GENERATED_WORLD_DONE,
		[
			handleStandardAdd({
				resourceName: generatedResourceName,
				payloadSelector: omit(['worldSitesAndPops'])
			}),
			handleStandardRemove({
				resourceName: pendingResourceName
			}),
			handleStandardAdd({
				resourceName: worldSitesAndPopsResourceName,
				payloadSelector: createWorldSitesAndPropsResource
			}),
			handleGeneratedWorldError
		]
	],
	[
		constants.REMOVE_GENERATED_WORLD,
		handleStandardRemove({
			resourceName: generatedResourceName
		})
	],
	[
		constants.RECEIVE_GENERATED_WORLDS,
		handleStandardReceive({
			resourceName: generatedResourceName,
			payloadSelector: prop('generatedWorlds')
		})
	],
	[
		constants.GENERATE_WORLD,
		handleStandardAdd({
			resourceName: pendingResourceName
		})
	],
	[
		constants.REMOVE_PENDING_GENERATED_WORLD,
		handleStandardRemove({
			resourceName: pendingResourceName
		})
	],
	[
		constants.ADD_ERRORED_GENERATED_WORLD,
		handleStandardAdd({
			resourceName: erroredResourceName,
			payloadSelector: prop('erroredGeneratedWorld')
		})
	],
	[
		constants.REMOVE_ERRORED_GENERATED_WORLD,
		handleStandardRemove({
			resourceName: erroredResourceName
		})
	],
	[
		constants.RECEIVE_WORLD_SITES_AND_POPS,
		handleStandardReceive({
			resourceName: worldSitesAndPopsResourceName,
			payloadSelector: prop('allWorldSitesAndPops')
		})
	],
	[
		constants.ADD_WORLD_SITES_AND_POPS,
		handleStandardAdd({
			resourceName: worldSitesAndPopsResourceName,
			payloadSelector: prop('worldSitesAndPops')
		})
	]
]);
