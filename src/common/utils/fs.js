import _fs from 'fs';
import R from 'ramda';
import Maybe from 'folktale/maybe';
import {chainRej, of as futureOf, reject} from 'fluture';
import {futurifyAll} from './futures';

const fs = futurifyAll(_fs);

export {fs};

export const maybeDirHasFile = R.curry((fileName, directoryPath) =>
	R.compose(
		R.map(R.compose(
			Maybe.fromNullable,
			R.find(R.equals(fileName))
		)),
		fs.readdirFuture
	)(directoryPath));

export const ensureDirectory = R.compose(
	chainRej(R.ifElse(R.propEq('code', 'EEXIST'), R.always(futureOf()), reject)),
	(dirPath) => fs.mkdirFuture(dirPath)
);
