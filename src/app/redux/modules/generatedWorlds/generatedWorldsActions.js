import R from 'ramda';
import _ from 'lodash';
import dfTools from 'df-tools';
import uuid from 'uuid';
import Promise from 'bluebird';
import {createPlainAction, makeErrorSerializable} from './../../utils';
import constants from './generatedWorldsConstants';
import * as globalErrorsActions from './../globalErrors';
import {selectGeneratedWorlds, selectWorldSitesAndPops} from './selectors';

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

			const createdAt = new Date();

			try {
				dispatch(createPlainAction(constants.ADD_PENDING_GENERATED_WORLD, {pendingGeneratedWorld: {id: genRequestId, dwarfFortressInstallId: installId, createdAt}}));
				const generatedWorld = await dfTools.worldgen.genWorld({dfRootPath: existingInstall.path, config});
				const {worldSitesAndPops, filePaths: worldFilePaths, region, worldHistory} = generatedWorld;
				const {worldName, friendlyWorldName} = worldHistory;
				const insertedGeneratedWorld = await database.model.GeneratedWorld.insert({
					dwarfFortressInstallId: installId,
					region,
					worldName,
					friendlyWorldName,
					createdAt,
					detailedMapPath: worldFilePaths.detailedMap,
					worldHistoryPath: worldFilePaths.worldHistory,
					worldMapPath: worldFilePaths.worldMap,
					worldSitesAndPopsPath: worldFilePaths.worldSitesAndPops,
					worldGenParamsPath: worldFilePaths.worldGenParams
				});

				const persistedGeneratedWorld = _.assign({}, insertedGeneratedWorld.toJSON(), {worldSitesAndPops, genRequestId, idx});
				dispatch(createPlainAction(constants.ADD_GENERATED_WORLD, {generatedWorld: persistedGeneratedWorld}));
				dispatch(createPlainAction(constants.ADD_WORLD_SITES_AND_POPS, {worldSitesAndPops: {id: persistedGeneratedWorld.id, ...worldSitesAndPops}}));
				dispatch(createPlainAction(constants.REMOVE_PENDING_GENERATED_WORLD, {id: genRequestId}));
				return {generatedWorld: persistedGeneratedWorld, error: null};
			} catch (err) {
				const error = makeErrorSerializable(err);
				dispatch(createPlainAction(constants.REMOVE_PENDING_GENERATED_WORLD, {id: genRequestId}));
				dispatch(createPlainAction(constants.ADD_ERRORED_GENERATED_WORLD, {erroredGeneratedWorld: {id: genRequestId, dwarfFortressInstallId: installId, error, createdAt}}));
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

export function populateWorldSitesAndPops({id, ids = [], force = false} = {}) {
	return async function populateWorldSitesAndPopsThunk(dispatch, getState) {
		try {
			const state = getState();
			const generatedWorlds = selectGeneratedWorlds(state);
			const existingWorldSitesAndPops = selectWorldSitesAndPops(state);

			const worlds = R.compose(
				R.when(
					R.always(!force),
					R.reject((world) => _.isEmpty(_.trim(world.worldSitesAndPopsPath)) || R.any((worldSitesAndPops) => worldSitesAndPops.id === world.id, existingWorldSitesAndPops))
				),
				R.when(
					R.isEmpty,
					R.always(generatedWorlds)
				),
				R.innerJoin(
					(world, worldId) => world.id === worldId,
					generatedWorlds
				),
				R.filter(R.identity),
				R.append
			)(id, ids);

			const allWorldSitesAndPops = await Promise.map(worlds, async (world) => {
				const {worldSitesAndPopsPath: filePath} = world;
				const worldSitesAndPops = await dfTools.worldgen.parseWorldSitesAndPops({filePath});
				return {id: world.id, ...worldSitesAndPops};
			});

			dispatch(createPlainAction(constants.RECEIVE_WORLD_SITES_AND_POPS, {allWorldSitesAndPops}));
		} catch (err) {
			dispatch(globalErrorsActions.addErrors(err));
		}
	};
}
