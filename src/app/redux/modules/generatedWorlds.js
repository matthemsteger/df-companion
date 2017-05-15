import _ from 'lodash';
import dfTools from 'df-tools';
import uuid from 'uuid';
import Promise from 'bluebird';
import {createConstant, createPlainAction, handleStandardAdd, handleStandardRemove, handleStandardReceive} from './../utils';
import * as globalErrorsActions from './globalErrors';

export const constants = createConstant(
	'ADD_GENERATED_WORLD', 'REMOVE_GENERATED_WORLD', 'RECEIVE_GENERATED_WORLDS', 'ADD_PENDING_GENERATED_WORLD',
	'REMOVE_PENDING_GENERATED_WORLD', 'ADD_ERRORED_GENERATED_WORLD', 'REMOVE_ERRORED_GENERATED_WORLD');

export function addGeneratedWorlds({installId, config, numWorlds = 1}) {
	return async function addGeneratedWorldsThunk(dispatch, getState, {database}) {
		let existingInstall = _.find(getState().dwarfFortressInstalls.installsById, {id: installId});
		if (!existingInstall) {
			const existingInstallModel = await database.model.DwarfFortressInstall.query().findById(installId);
			if (existingInstallModel) {
				existingInstall = existingInstallModel.toJSON();
			}
		}

		if (!existingInstall) {
			dispatch(globalErrorsActions.addErrors(new Error(`Could not find install with id ${installId}`)));
			return undefined;
		}

		return Promise.mapSeries(_.times(numWorlds), async (idx) => {
			const genRequestId = uuid();

			try {
				dispatch(createPlainAction(constants.ADD_PENDING_GENERATED_WORLD, {pendingGeneratedWorld: {genRequestId, installId}}));
				const generatedWorld = await dfTools.worldGen.genWorld({dfRootPath: existingInstall.path, config});
				const {worldSitesAndPops, filePaths: worldFilePaths, region, worldHistory} = generatedWorld;
				const {worldName, friendlyWorldName} = worldHistory;
				const insertedGeneratedWorld = await database.model.GeneratedWorld.insert({
					region,
					worldName,
					friendlyWorldName,
					detailedMapPath: worldFilePaths.detailedMap,
					worldHistoryPath: worldFilePaths.worldHistory,
					worldMapPath: worldFilePaths.worldMap,
					worldSitesAndPopsPath: worldFilePaths.worldSitesAndPops,
					worldGenParamsPath: worldFilePaths.worldGenParams
				});

				const persistedGeneratedWorld = _.assign({}, insertedGeneratedWorld.toJSON(), {worldSitesAndPops, genRequestId, idx});
				dispatch(createPlainAction(constants.ADD_GENERATED_WORLD, {generatedWorld: persistedGeneratedWorld}));
				return {generatedWorld: persistedGeneratedWorld, error: null};
			} catch (err) {
				dispatch(createPlainAction(constants.REMOVE_PENDING_GENERATED_WORLD, {genRequestId, installId}));
				dispatch(createPlainAction(constants.ADD_ERRORED_GENERATED_WORLD, {erroredGeneratedWorld: {genRequestId, installId, error: err}}));
				return {generatedWorld: null, error: err};
			}
		});
	};
}

export function removeGeneratedWorld(generatedWorldId) {
	return async function removeGeneratedWorldThunk(dispatch, getState, {database}) {
		try {
			const numRemoved = await database.model.GeneratedWorld.deleteById(generatedWorldId);
			if (numRemoved > 0) {
				dispatch(createPlainAction(constants.REMOVE_GENERATED_WORLD, {generatedWorldId}));
			}

			return numRemoved;
		} catch (err) {
			dispatch(globalErrorsActions.addErrors(err));
			return undefined;
		}
	};
}

export function getGeneratedWorlds() {
	return async function getGeneratedWorldsThunk(dispatch, getState, {database}) {
		try {
			const generatedWorlds = await database.model.GeneratedWorld.getAll();
			dispatch(createPlainAction(constants.RECEIVE_GENERATED_WORLDS, {generatedWorlds}));
			return generatedWorlds;
		} catch (err) {
			dispatch(globalErrorsActions.addErrors(err));
			return [];
		}
	};
}

const initialState = {
	generatedWorldsById: {},
	generatedWorlds: [],
	pendingGeneratedWorldsById: {},
	pendingGeneratedWorlds: [],
	erroredGeneratedWorldsById: {},
	erroredGeneratedWorlds: []
};

const resourceName = 'generatedWorlds';
const pendingResourceName = 'pendingGeneratedWorlds';
const erroredResourceName = 'erroredGeneratedWorlds';

export default function generatedWorldsReducer(state = initialState, action) {
	switch (action.type) {
		case constants.ADD_GENERATED_WORLD:
			if (action.payload.generatedWorld) {
				return handleStandardAdd({state, id: action.payload.generatedWorld.id, resource: action.payload.generatedWorld, resourceName});
			}

			return state;
		case constants.REMOVE_GENERATED_WORLD:
			if (_.has(action, 'payload.generatedWorldId')) {
				return handleStandardRemove({state, id: action.payload.generatedWorldId, resourceName});
			}

			return state;
		case constants.RECEIVE_GENERATED_WORLDS:
			if (_.isArray(action.payload.generatedWorlds)) {
				return handleStandardReceive({state, idProp: 'id', resources: action.payload.generatedWorlds, resourceName});
			}

			return state;
		case constants.ADD_PENDING_GENERATED_WORLD:
			if (action.payload.pendingGeneratedWorld) {
				return handleStandardAdd({
					state,
					id: action.payload.pendingGeneratedWorld.genRequestId,
					resource: action.payload.pendingGeneratedWorld,
					pendingResourceName
				});
			}

			return state;
		case constants.REMOVE_PENDING_GENERATED_WORLD:
			if (_.has(action, 'payload.genRequestId')) {
				return handleStandardRemove({state, id: action.payload.genRequestId, pendingResourceName});
			}

			return state;
		case constants.ADD_ERRORED_GENERATED_WORLD:
			if (action.payload.erroredGeneratedWorld) {
				return handleStandardAdd({
					state,
					id: action.payload.erroredGeneratedWorld.genRequestId,
					resource: action.payload.erroredGeneratedWorld,
					erroredResourceName
				});
			}

			return state;
		case constants.REMOVE_ERRORED_GENERATED_WORLD:
			if (_.has(action, 'payload.genRequestId')) {
				return handleStandardRemove({state, id: action.payload.genRequestId, erroredResourceName});
			}

			return state;
		default:
			return state;
	}
}
