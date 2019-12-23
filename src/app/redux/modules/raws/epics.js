import {selectArray} from 'redux-most';
import {from as streamFrom, join as joinStream} from 'most';
import {
	__ as placeholder,
	always,
	assoc,
	both,
	compose,
	contains,
	curry,
	equals,
	identity,
	ifElse,
	is,
	isNil,
	map,
	of as arrayOf,
	prop,
	propIs,
	reject,
	unless
} from 'ramda';
import dfTools from 'df-tools';
import Maybe from 'folktale/maybe';
import {of as futureOf, parallel, fold as foldFuture} from 'fluture';
import {errorToAction} from '@matthemsteger/redux-utils-fn-actions';
import {readJSONFile} from './../../../../common/utils/fs';
import {constants as rawFilesConstants} from './../rawFiles';
import {finishCreateModeledRawFile} from './actionCreators';
import {
	futureToStream,
	chainWithContext,
	foldMaybe,
	filterUnerroredActions
} from './../../epicUtilities';

const supportedRawFileTypes = [dfTools.raws.rawFileTypes.CREATURE];

const maybeSupportedRawFileType = (rawFile) =>
	compose(
		ifElse(
			equals(true),
			always(Maybe.Just(rawFile)),
			always(Maybe.Nothing())
		),
		both(
			compose(
				contains(placeholder, supportedRawFileTypes),
				prop('rawFileType')
			),
			propIs(String, 'parsedCachePath')
		)
	)(rawFile);

const modelCreature = curry((rawFile, creature) =>
	compose(
		assoc('rawFileId', prop('id', rawFile)),
		assoc('installId', prop('installId', rawFile)),
		assoc('rawFileType', prop('rawFileType', rawFile))
	)(creature)
);

const modelCreatureRaw = curry((rawFile, creatureRaw) =>
	compose(
		map(modelCreature(rawFile)),
		dfTools.raws.modelParsedCreatureRaw
	)(creatureRaw)
);

const readAndModelRawFile = (rawFile) =>
	compose(
		foldMaybe(always(futureOf(null)), identity),
		map(
			compose(
				map(modelCreatureRaw(rawFile)),
				readJSONFile,
				prop('parsedCachePath')
			)
		),
		maybeSupportedRawFileType
	)(rawFile);

// eslint-disable-next-line import/prefer-default-export
export const modelRawFilesEpic = compose(
	chainWithContext(({payload: singleOrArrayRawFiles}) =>
		compose(
			joinStream,
			map(streamFrom),
			futureToStream,
			foldFuture(
				errorToAction(finishCreateModeledRawFile),
				map(finishCreateModeledRawFile)
			),
			map(reject(isNil)),
			parallel(Number.POSITIVE_INFINITY),
			map(readAndModelRawFile),
			unless(is(Array), arrayOf)
		)(singleOrArrayRawFiles)
	),
	filterUnerroredActions,
	selectArray([
		rawFilesConstants.LIST_RAW_FILE_DONE,
		rawFilesConstants.UPDATE_RAW_FILE_DONE
	])
);
