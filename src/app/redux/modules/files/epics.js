import {select} from 'redux-most';
import {compose} from 'ramda';
import {fold as foldFuture} from 'fluture';
import {errorToAction} from '@matthemsteger/redux-utils-fn-actions';
import {futureToStream, chainWithContext} from './../../epicUtilities';
import constants from './constants';
import {
	finishListFiles,
	finishCreateFile,
	finishUpdateFile
} from './actionCreators';

export const listFilesEpic = compose(
	chainWithContext(({db}) =>
		compose(
			futureToStream,
			foldFuture(errorToAction(finishListFiles), finishListFiles),
			db.File.fetchAll
		)()
	),
	select(constants.LIST_FILE)
);

export const createFileEpic = compose(
	chainWithContext(({db, payload: file}) =>
		compose(
			futureToStream,
			foldFuture(errorToAction(finishCreateFile), finishCreateFile),
			db.File.insert
		)(file)
	),
	select(constants.CREATE_FILE)
);

export default compose(
	chainWithContext(({db, payload: file}) =>
		compose(
			futureToStream,
			foldFuture(errorToAction(finishUpdateFile), finishUpdateFile),
			db.File.update
		)(file)
	),
	select(constants.UPDATE_FILE)
);
