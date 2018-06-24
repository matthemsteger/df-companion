import {select, selectArray} from 'redux-most';
import {from as streamFrom, tap as _tapStream, join as joinStream, throwError as streamOfError, just as streamOf, empty} from 'most';
import R from 'ramda';
import dfTools from 'df-tools';
import {parallel, fold as foldFuture, value as futureValue} from 'fluture';
import crypto from 'crypto';
import Maybe from 'folktale/maybe';
import shortid from 'shortid';
import path from 'path';
import constants from './constants';
import {constants as installConstants, selectInstalls, selectInstallById} from './../dwarfFortressInstalls';
import {findRawFiles, finishFindRawFiles, createRawFile, finishCreateRawFile, deleteRawFile, updateRawFile, parseRawFileWorker, finishUpdateRawFile, finishListRawFiles} from './actionCreators';
import {sendActionToWorker, errorToAction, actionIsErrored} from './../../utils';
import {futureToStream, createEpicContext, fromState, valueIntoContext, mapObjectWithFutures, fromDatabase, getOrElseMaybe, chainWithContext, mapWithContext} from './../../epicUtilities';
import {selectCombinedHashesByInstallId} from './selectors';
import {calculateAddsDeletesUpdates, concatAndFlatten} from './../../../../common/utils/lists';

const unlimitedParallel = parallel(Number.POSITIVE_INFINITY);
const parallelConverge = R.unapply(unlimitedParallel);
const pathRelative = R.curry(path.relative);
const parseRawFileWorkerWithInstall = R.curry((install, rawFile) => parseRawFileWorker({install, rawFile}));

function getCombinedHash(hashStrings) {
	const hash = crypto.createHash('md5');
	hash.update(hashStrings.sort().join(''));
	return hash.digest('hex');
}

function rawFileUpdatedPredicate(older, newer) {
	const fields = ['hash', 'rawFileType'];
	return R.or(
		R.not(R.equals(R.pick(fields, older), R.pick(fields, newer))),
		R.propSatisfies(R.isNil, 'parsedCachePath', older)
	);
}

const calculateRawFileAddsDeletesAndUpdates = calculateAddsDeletesUpdates(
	R.prop('filePath'),
	rawFileUpdatedPredicate
);

const addInstallIdToInstalls = R.curry((installId, installs) =>	R.map(R.merge(R.__, {installId}), installs));
const makeFilePathsRelative = R.curry((installPath, installs) => R.map(R.evolve({filePath: pathRelative(installPath)}), installs));

const getAllRawFiles = R.curry((installId, installPath) =>
	R.compose(
		R.map(makeFilePathsRelative(installPath)),
		R.map(addInstallIdToInstalls(installId)),
		dfTools.raws.getAllRawFiles
	)(installPath));

const getRawsFromSources = R.curry((installPath, installId, context) => {
	const allRawFiles = getAllRawFiles(installId, installPath);
	return R.converge(
		parallelConverge,
		[R.always(allRawFiles), fromDatabase((db) => db.RawFile.findByObjMatch({installId}))]
	)(context);
});

const getRawFilesCombinedHash = R.compose(
	getCombinedHash,
	R.map(R.prop('hash'))
);

const combineWithDatabaseRaw = R.curry((databaseRawFiles, other) => {
	return R.compose(
		R.merge(other),
		R.find(R.both(
			R.propEq('installId', R.prop('installId', other)),
			R.propEq('filePath', R.prop('filePath', other))
		))
	)(databaseRawFiles);
});

const processChanges = R.curry((install, databaseRawFiles, changes) => {
	const {adds = [], updates = [], deletes = [], unchanged = []} = changes;
	return R.flatten([
		R.compose(R.map(finishListRawFiles), R.of, R.map(combineWithDatabaseRaw(databaseRawFiles)))(unchanged),
		R.map(createRawFile, adds),
		R.map(R.compose(parseRawFileWorkerWithInstall(install), R.apply(R.merge)), updates),
		R.compose(R.map(finishListRawFiles), R.of, R.map(R.nth(0)))(updates),
		R.map(deleteRawFile, deletes)
	]);
});

const reconcileSources = R.curry((install, installHash, [currentRawFiles, databaseRawFiles]) => {
	return R.compose(
		processChanges(install, databaseRawFiles),
		getOrElseMaybe(R.objOf('unchanged', databaseRawFiles)),
		R.map(R.always(calculateRawFileAddsDeletesAndUpdates(databaseRawFiles, currentRawFiles))),
		R.ifElse(R.equals(installHash), R.always(Maybe.empty()), Maybe.of),
		getRawFilesCombinedHash
	)(currentRawFiles);
});

const ensureMetaInstallMapper = R.curry((context, install) => {
	const {path: installPath, id: installId, hash: installHash} = install;
	return R.compose(
		R.map(reconcileSources(install, installHash)),
		getRawsFromSources(installPath, installId)
	)(context);
});

/**
 * Ensure meta data and cache for a list of installs
 * @param {Install[]} action.payload - List of installs
 * @returns {FSA[]} Array of FSAs to update meta
 */
export const ensureMetaFromInstalls = R.compose(
	R.chain(R.compose(
		joinStream,
		R.map(streamFrom),
		futureToStream,
		R.map(R.flatten),
		unlimitedParallel,
		// each install -> fire off action creators
		// each install -> calculate adds/updates/deletes for raw files
		// each install -> if combined hash is same, do nothing
		// each install -> get metas from actual disk, plus combined hash
		// each install -> get raw file metas from db
		// get installs (has combinedRawsHash property) from payload
		R.converge(R.map, [R.unary(ensureMetaInstallMapper), R.prop('payload')]),
		createEpicContext,
	)),
	select(installConstants.LIST_INSTALL_DONE)
);

export const createRawFileEpic = R.compose(
	chainWithContext(({db, payload: rawFile}) => {
		return R.compose(
			futureToStream,
			foldFuture(errorToAction(finishCreateRawFile), finishCreateRawFile),
			db.RawFile.insert
		)(rawFile);
	}),
	select(constants.CREATE_RAW_FILE)
);

export const parseCreatedRawFileEpic = R.compose(
	mapWithContext(({payload: rawFile, state}) => {
		const {installId} = rawFile;
		const install = selectInstallById(state)(installId);
		return parseRawFileWorkerWithInstall(install, rawFile);
	}),
	select(constants.CREATE_RAW_FILE_DONE)
);

export const updateParsedRawFileEpic = R.compose(
	R.chain(R.compose(R.ifElse(actionIsErrored, R.always(empty()), R.compose(streamOf, updateRawFile, R.prop('payload'))))),
	select(constants.PARSE_RAW_FILE_DONE)
);

export const updateRawFileEpic = R.compose(
	chainWithContext(({db, payload: rawFile}) => {
		return R.compose(
			futureToStream,
			foldFuture(errorToAction(finishUpdateRawFile), finishUpdateRawFile),
			db.RawFile.update
		)(rawFile);
	}),
	select(constants.UPDATE_RAW_FILE)
);

/**
 * When installs are received or new install is created, then we check to see if
 * there are raw files for those installs, if not, start getting them
 */
// export const discoverInstallRaws = R.compose(
// 	R.chain(R.compose(
// 		streamFrom,
// 		R.map(findRawFiles),
// 		R.converge(R.difference, [R.prop('installIds'), R.prop('existingHashedInstallIds')]),
// 		valueIntoContext('existingHashedInstallIds', R.compose(R.keys, fromState(selectCombinedHashesByInstallId))),
// 		valueIntoContext('installIds', R.compose(R.map(R.prop('id')), fromState(selectInstalls))),
// 		createEpicContext
// 	)),
// 	selectArray(findInstallRawFilesActions)
// );

// this should check existing raw files also, and then add a change boolean
// that boolean can be picked up by another epic here that will issue raw parses
// for those files that are new/changed/deleted
// probably need to raw file meta in the database so that we can clean up cached versions

// RETHINK: List Installs -> Get Meta from DB, compare meta, fire off updates to raws
// RETHINK: Create Install -> Get Meta, store in DB, fire off updates to raws
// RETHINK: Remove Install -> Get Meta from DB, delete cache, delete Meta from DB
// RETHINK: Raw epics will parse raws and then update meta DB with cached parses, as well as pop redux
// RETHINK: Edge case -> raw file changes during process
// export const findInstallRawFiles = R.compose(
// 	R.chain(R.compose(
// 		futureToStream,
// 		foldFuture((err) => finishFindRawFiles(err, true), finishFindRawFiles),
// 		mapObjectWithFutures(Number.POSITIVE_INFINITY, R.compose(
// 			R.pick(['hash', 'installId', 'rawFiles']),
// 			valueIntoContext('hash', R.compose(getCombinedHash, R.map(R.prop('hash')), R.prop('rawFiles'))),
// 		)),
// 		valueIntoContext('rawFiles', R.compose(dfTools.raws.getAllRawFiles, R.propPath(['install', 'path']))),
// 		valueIntoContext('installId', R.prop('payload')),
// 		valueIntoContext('install', R.converge(R.find, [R.compose(R.propEq('id'), R.prop('payload')), R.prop('installs')])),
// 		valueIntoContext('installs', fromState(selectInstalls)),
// 		createEpicContext
// 	)),
// 	select(constants.FIND_INSTALL_RAW_FILES)
// );

// after install added/list
// get all raws with metadata
// if database has no raws with metadata records, then kick off parses
// parses will get the metadata in the action payload, and will be in charge
// of parsing the raws, and then committing metadata to db, as well as parse output to file cache
// if database filename has different has, or there are adds/subtracts to files, kick off parsing
// of those files and/or delete meta and parse file cache for files that are removed
