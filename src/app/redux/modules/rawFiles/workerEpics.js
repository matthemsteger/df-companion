import R from 'ramda';
import {select} from 'redux-most';
import dfTools from 'df-tools';
import Maybe from 'folktale/maybe';
import path from 'path';
import {empty, of as streamOf} from 'most';
import {fold as foldFuture, of as futureOf, reject as rejectedFutureOf} from 'fluture';
import constants from './constants';
import {finishParseRawFileWorker} from './actionCreators';
import {foldMaybe, futureToStream} from './../../epicUtilities';
import {errorToAction} from './../../utils';
import {fs} from './../../../../common/utils/fs';

const addRawFileToActionError = R.curry((rawFile, errorAction) => R.assocPath(['payload', 'rawFileId'], R.prop('_id', rawFile), errorAction));

const makeRawFileErrorAction = R.curry((rawFile, errorAction, error) => R.compose(addRawFileToActionError(rawFile), errorToAction(errorAction))(error));

const makeRawCacheFileName = R.curry((appRoot, hash, rawFilePath) => {
	const rawFileName = path.basename(rawFilePath, '.txt');
	return path.join(appRoot, 'df-raw-cache', `${rawFileName}-${hash}.json`);
});

const supportedRawFileTypes = [
	dfTools.raws.rawFileTypes.CREATURE
];

const maybeSupportedRawFileType = (rawFileType) =>
	R.compose(
		R.ifElse(R.equals(true), R.always(Maybe.Just(rawFileType)), R.always(Maybe.Nothing())),
		R.contains(R.__, supportedRawFileTypes)
	)(rawFileType);

/**
 * Write a parsedRaw to a cache file
 * @param {string} hash
 * @param {string} filePath
 * @param {object} parsedRaw
 * @returns {Future<rawFileCachePath>}
 */
const outputParsedToFile = R.curry((appRoot, hash, filePath, parsedRaw) => {
	const rawFileCacheFilePath = makeRawCacheFileName(appRoot, hash, filePath);

	return R.map(
		R.always(rawFileCacheFilePath),
		fs.writeFileFuture(rawFileCacheFilePath, JSON.stringify(parsedRaw))
	);
});

const handleParseResult = (parseResult) => {
	return R.ifElse(
		R.propEq('status', true),
		R.compose(futureOf, R.prop('value')),
		R.compose(rejectedFutureOf, R.always(new Error('TODO: Add parse result error')))
	)(parseResult);
};

const parseRawAndOutputRawFilePath = R.curry((appRoot, install, rawFile) => {
	const {hash, filePath, rawFileType} = rawFile;
	const {path: installPath} = install;
	const rawFilePath = path.join(installPath, filePath);

	return R.compose(
		R.chain(outputParsedToFile(appRoot, hash, filePath)),
		R.chain(handleParseResult),
		dfTools.raws.parseRawFile(rawFileType)
	)(rawFilePath);
});

/**
 * Create the raw file parse output, cache to file system
 * @param {RawFile} action.payload - raw file
 * @returns {FSA<RawFile>} RawFile with parsed file path
 */
export const parseAndCacheRawFile = R.compose(
	R.chain(({payload: {install, rawFile}, meta: {appRoot}}) => {
		return R.compose(
			foldMaybe(R.always(streamOf(makeRawFileErrorAction(rawFile, finishParseRawFileWorker, {message: `rawFileType ${R.prop('rawFileType', rawFile)} is not supported`}))), futureToStream),
			R.map(R.compose(foldFuture(makeRawFileErrorAction(rawFile, finishParseRawFileWorker), finishParseRawFileWorker), R.map(R.compose(R.merge(rawFile), R.objOf('parsedCachePath'))), parseRawAndOutputRawFilePath(appRoot, install))),
			R.compose(R.map(R.always(rawFile)), maybeSupportedRawFileType, R.prop('rawFileType'))
		)(rawFile);
	}),
	select(constants.WORKER_PARSE_RAW_FILE)
);

// 1. parse file
// 2. output result to json file named for filename_hash.json
// 3. save to database
// 4. return full representation in done action
