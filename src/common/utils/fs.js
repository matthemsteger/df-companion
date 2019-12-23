import _fs from 'fs';
import {
	curry,
	compose,
	map,
	find,
	equals,
	ifElse,
	propEq,
	always,
	converge,
	identity,
	chain
} from 'ramda';
import Maybe from 'folktale/maybe';
import {
	chainRej,
	of as futureOf,
	reject,
	encase as encaseFuture
} from 'fluture';
import {futurifyAll} from './futures';

const fs = futurifyAll(_fs);

export {fs};

export const maybeDirHasFile = curry((fileName, directoryPath) =>
	compose(
		map(
			compose(
				Maybe.fromNullable,
				find(equals(fileName))
			)
		),
		fs.readdirFuture
	)(directoryPath)
);

export const ensureDirectory = compose(
	chainRej(ifElse(propEq('code', 'EEXIST'), always(futureOf()), reject)),
	(dirPath) => fs.mkdirFuture(dirPath)
);

export const readUtf8File = converge(fs.readFileFuture, [
	identity,
	always('utf8')
]);

export const readJSONFile = compose(
	chain(encaseFuture(JSON.parse)),
	readUtf8File
);
