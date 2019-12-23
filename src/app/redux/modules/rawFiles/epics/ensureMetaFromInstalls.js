import {select} from 'redux-most';
import {
	compose,
	chain,
	map,
	flatten,
	converge,
	unary,
	prop,
	curry,
	objOf,
	always,
	ifElse,
	equals,
	of as arrayOf,
	apply,
	merge,
	nth,
	find,
	both,
	propEq,
	or,
	not,
	pick,
	propSatisfies,
	isNil,
	evolve,
	__ as placeholder
} from 'ramda';
import path from 'path';
import crypto from 'crypto';
import Maybe from 'folktale/maybe';
import {from as streamFrom, join as joinStream} from 'most';
import dfTools from 'df-tools';
import {calculateAddsDeletesUpdates} from './../../../../../common/utils/lists';
import {
	unlimitedParallel,
	parallelConverge
} from './../../../../../common/utils/futures';
import {
	futureToStream,
	createEpicContext,
	getOrElseMaybe,
	fromDatabase
} from './../../../epicUtilities';
import {constants as installConstants} from './../../dwarfFortressInstalls';
import {
	createRawFile,
	deleteRawFile,
	finishListRawFiles
} from './../actionCreators';
import parseRawFileWorkerWithInstall from './parseRawFileWorkerWithInstall';

const combineWithDatabaseRaw = curry((databaseRawFiles, other) =>
	compose(
		merge(other),
		find(
			both(
				propEq('installId', prop('installId', other)),
				propEq('filePath', prop('filePath', other))
			)
		)
	)(databaseRawFiles)
);

const processChanges = curry((install, databaseRawFiles, changes) => {
	const {adds = [], updates = [], deletes = [], unchanged = []} = changes;
	return flatten([
		compose(
			map(finishListRawFiles),
			arrayOf,
			map(combineWithDatabaseRaw(databaseRawFiles))
		)(unchanged),
		map(createRawFile, adds),
		map(
			compose(
				parseRawFileWorkerWithInstall(install),
				apply(merge)
			),
			updates
		),
		compose(
			map(finishListRawFiles),
			arrayOf,
			map(nth(0))
		)(updates),
		map(deleteRawFile, deletes)
	]);
});

function getCombinedHash(hashStrings) {
	const hash = crypto.createHash('md5');
	hash.update(hashStrings.sort().join(''));
	return hash.digest('hex');
}

const getRawFilesCombinedHash = compose(
	getCombinedHash,
	map(prop('hash'))
);

function rawFileUpdatedPredicate(older, newer) {
	const fields = ['hash', 'rawFileType'];
	return or(
		not(equals(pick(fields, older), pick(fields, newer))),
		propSatisfies(isNil, 'parsedCachePath', older)
	);
}

const calculateRawFileAddsDeletesAndUpdates = calculateAddsDeletesUpdates(
	prop('filePath'),
	rawFileUpdatedPredicate
);

const reconcileSources = curry(
	(install, installHash, [currentRawFiles, databaseRawFiles]) =>
		compose(
			processChanges(install, databaseRawFiles),
			getOrElseMaybe(objOf('unchanged', databaseRawFiles)),
			map(
				always(
					calculateRawFileAddsDeletesAndUpdates(
						databaseRawFiles,
						currentRawFiles
					)
				)
			),
			ifElse(equals(installHash), always(Maybe.empty()), Maybe.of),
			getRawFilesCombinedHash
		)(currentRawFiles)
);

const addInstallIdToInstalls = curry((installId, installs) =>
	map(merge(placeholder, {installId}), installs)
);

const pathRelative = curry(path.relative);

const makeFilePathsRelative = curry((installPath, installs) =>
	map(evolve({filePath: pathRelative(installPath)}), installs)
);

const getAllRawFiles = curry((installId, installPath) =>
	compose(
		map(makeFilePathsRelative(installPath)),
		map(addInstallIdToInstalls(installId)),
		dfTools.raws.getAllRawFiles
	)(installPath)
);

const getRawsFromSources = curry((installPath, installId, context) => {
	const allRawFiles = getAllRawFiles(installId, installPath);
	return converge(parallelConverge, [
		always(allRawFiles),
		fromDatabase((db) => db.RawFile.findByObjMatch({installId}))
	])(context);
});

const ensureMetaInstallMapper = curry((context, install) => {
	const {path: installPath, id: installId, hash: installHash} = install;
	return compose(
		map(reconcileSources(install, installHash)),
		getRawsFromSources(installPath, installId)
	)(context);
});

/**
 * Ensure meta data and cache for a list of installs
 * @param {Install[]} action.payload - List of installs
 * @returns {FSA[]} Array of FSAs to update meta
 */
export default compose(
	chain(
		compose(
			joinStream,
			map(streamFrom),
			futureToStream,
			map(flatten),
			unlimitedParallel,
			// each install -> fire off action creators
			// each install -> calculate adds/updates/deletes for raw files
			// each install -> if combined hash is same, do nothing
			// each install -> get metas from actual disk, plus combined hash
			// each install -> get raw file metas from db
			// get installs (has combinedRawsHash property) from payload
			converge(map, [unary(ensureMetaInstallMapper), prop('payload')]),
			createEpicContext
		)
	),
	select(installConstants.LIST_INSTALL_DONE)
);
