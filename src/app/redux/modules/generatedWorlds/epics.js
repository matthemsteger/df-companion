import {select} from 'redux-most';
import {from as streamFrom, concatMap as _concatMap} from 'most';
import R from 'ramda';
import {fold as foldFuture, of as futureOf} from 'fluture';
import Maybe from 'folktale/maybe';
import uuid from 'uuid';
import dfTools from 'df-tools';
import {futureToStream, chainAction, foldMaybe} from './../../epicUtilities';
import constants from './constants';
import {generateWorld, createGeneratedWorld, finishCreateGeneratedWorld} from './actionCreators';
import {selectInstallById} from './../dwarfFortressInstalls';

const concatMap = R.curry(_concatMap);

/**
 * takes in a config for generated multiple worlds, outputs an action to generate each world
 * @param  {Observable<Action>} action$
 * @return {Observable<Action>}                  CREATE_GENERATED_WORLD actions stream
 */
export const generateWorldsEpic = R.compose(
	R.chain(({payload: {installId, config, numWorlds = 1}}) =>
		R.compose(
			R.map(() => generateWorld({
				id: uuid(),
				createdAt: new Date().toISOString(),
				dwarfFortressInstallId: installId,
				config
			})),
			streamFrom
		)(R.range(0, numWorlds))
	),
	select(constants.GENERATE_WORLDS)
);

// cancel notes -> likely need a weakmap of cancel functions
// then could basically wrap cancel in another function, if cancel
// is executed, then we return an action to delete pending
// if cancel is not executed and we finish, continue
// if cancel is not executed and we error, do error

const extractGeneratedWorldInfo = ({
	worldSitesAndPops,
	filePaths: {
		detailedMap: detailedMapPath,
		worldHistory: worldHistoryPath,
		worldMap: worldMapPath,
		worldSitesAndPops: worldSitesAndPopsPath,
		worldGenParams: worldGenParamsPath
	},
	region,
	worldHistory: {
		worldName,
		friendlyWorldName
	}
}) => ({
	worldSitesAndPops,
	detailedMapPath,
	worldHistoryPath,
	worldMapPath,
	worldSitesAndPopsPath,
	worldGenParamsPath,
	region,
	worldName,
	friendlyWorldName
});

const createGeneratedWorldError = R.curry((error, generatedWorld) => R.merge(error, {generatedWorld}));

export const generateWorldEpic = (action$, {getState}) =>
	R.compose(
		concatMap(({payload: {id, dwarfFortressInstallId, config, createdAt}}) =>
			R.compose(
				futureToStream,
				foldFuture(
					(error) => createGeneratedWorld(createGeneratedWorldError(error, {id, dwarfFortressInstallId, config, createdAt}), true),
					R.identity
				),
				foldMaybe(
					R.always(futureOf(createGeneratedWorld(createGeneratedWorldError(
						new Error(`Could not find install ${dwarfFortressInstallId}`),
						{
							id,
							dwarfFortressInstallId,
							config,
							createdAt
						}
					), true))),
					R.identity
				),
				R.map(R.compose(
					R.map(R.compose(
						createGeneratedWorld,
						R.merge({id, dwarfFortressInstallId, createdAt: new Date().toISOString()}),
						extractGeneratedWorldInfo
					)),
					dfTools.worldgen.genWorld,
					(dfRootPath) => ({dfRootPath, config}),
					R.prop('path')
				)),
				Maybe.fromNullable,
				R.always(selectInstallById(getState(), dwarfFortressInstallId))
			)()
		),
		select(constants.GENERATE_WORLD)
	)(action$);

export const createGeneratedWorldEpic = R.compose(
	R.chain(chainAction((database, generatedWorld) =>
		R.compose(
			futureToStream,
			foldFuture(R.partialRight(finishCreateGeneratedWorld, [true]), finishCreateGeneratedWorld),
			R.map(R.merge(R.pick(['worldSitesAndPops'], generatedWorld))),
			database.generatedWorlds.insert,
			R.omit(['worldSitesAndPops'])
		)(generatedWorld)
	)),
	select(constants.CREATE_GENERATED_WORLD)
);
