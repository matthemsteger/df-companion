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

export default createReducer(initialState, [
	[constants.ADD_GENERATED_WORLD, handleStandardAdd({
		resourceName: generatedResourceName,
		payloadSelector: R.prop('generatedWorld')
	})],
	[constants.REMOVE_GENERATED_WORLD, handleStandardRemove({
		resourceName: generatedResourceName
	})],
	[constants.RECEIVE_GENERATED_WORLDS, handleStandardReceive({
		resourceName: generatedResourceName,
		payloadSelector: R.prop('generatedWorlds')
	})],
	[constants.ADD_PENDING_GENERATED_WORLD, handleStandardAdd({
		resourceName: pendingResourceName,
		payloadSelector: R.prop('pendingGeneratedWorld')
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
