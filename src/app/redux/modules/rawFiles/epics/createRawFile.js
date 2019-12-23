import {select} from 'redux-most';
import {compose} from 'ramda';
import {fold as foldFuture} from 'fluture';
import {errorToAction} from '@matthemsteger/redux-utils-fn-actions';
import {futureToStream, chainWithContext} from './../../../epicUtilities';
import {finishCreateRawFile} from './../actionCreators';
import constants from './../constants';

export default compose(
	chainWithContext(({db, payload: rawFile}) =>
		compose(
			futureToStream,
			foldFuture(errorToAction(finishCreateRawFile), finishCreateRawFile),
			db.RawFile.insert
		)(rawFile)
	),
	select(constants.CREATE_RAW_FILE)
);
