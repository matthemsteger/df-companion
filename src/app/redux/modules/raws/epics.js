import {selectArray} from 'redux-most';
import {from as streamFrom, join as joinStream} from 'most';
import R from 'ramda';
import dfTools from 'df-tools';
import Maybe from 'folktale/maybe';
import {of as futureOf, parallel, fold as foldFuture, encase as encaseFuture} from 'fluture';
import {fs} from './../../../../common/utils/fs';
import {constants as rawFilesConstants} from './../rawFiles';
import {finishCreateModeledRawFile} from './actionCreators';
import {errorToAction} from './../../utils';
import {futureToStream, chainWithContext, foldMaybe, filterUnerroredActions} from './../../epicUtilities';

const readUtf8File = R.converge(fs.readFileFuture, [R.identity, R.always('utf8')]);
const readJSONFile = R.compose(R.chain(encaseFuture(JSON.parse)), readUtf8File);

const supportedRawFileTypes = [
	dfTools.raws.rawFileTypes.CREATURE
];

const maybeSupportedRawFileType = (rawFile) =>
	R.compose(
		R.ifElse(R.equals(true), R.always(Maybe.Just(rawFile)), R.always(Maybe.Nothing())),
		R.both(
			R.compose(R.contains(R.__, supportedRawFileTypes), R.prop('rawFileType')),
			R.propIs(String, 'parsedCachePath')
		)
	)(rawFile);

const modelCreature = R.curry((rawFile, creature) =>
	R.compose(
		R.assoc('rawFileId', R.prop('id', rawFile)),
		R.assoc('installId', R.prop('installId', rawFile)),
		R.assoc('rawFileType', R.prop('rawFileType', rawFile))
	)(creature));

const modelCreatureRaw = R.curry((rawFile, creatureRaw) =>
	R.compose(
		R.map(modelCreature(rawFile)),
		dfTools.raws.modelParsedCreatureRaw
	)(creatureRaw));

const readAndModelRawFile = (rawFile) =>
	R.compose(
		foldMaybe(R.always(futureOf(null)), R.identity),
		R.map(R.compose(R.map(modelCreatureRaw(rawFile)), readJSONFile, R.prop('parsedCachePath'))),
		maybeSupportedRawFileType,
	)(rawFile);

export const modelRawFilesEpic = R.compose( // eslint-disable-line import/prefer-default-export
	chainWithContext(({payload: singleOrArrayRawFiles}) =>
		R.compose(
			joinStream,
			R.map(streamFrom),
			futureToStream,
			foldFuture(errorToAction(finishCreateModeledRawFile), R.map(finishCreateModeledRawFile)),
			R.map(R.reject(R.isNil)),
			parallel(Number.POSITIVE_INFINITY),
			R.map(readAndModelRawFile),
			R.unless(R.is(Array), R.of),
		)(singleOrArrayRawFiles)),
	filterUnerroredActions,
	selectArray([
		rawFilesConstants.LIST_RAW_FILE_DONE,
		rawFilesConstants.UPDATE_RAW_FILE_DONE
	])
);
