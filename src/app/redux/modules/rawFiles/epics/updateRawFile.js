import {compose} from 'ramda';
import {select} from 'redux-most';
import {fold as foldFuture} from 'fluture';
import {errorToAction} from '@matthemsteger/redux-utils-fn-actions';
import {futureToStream, chainWithContext} from './../../../epicUtilities';
import {finishUpdateRawFile} from './../actionCreators';
import constants from './../constants';

export default compose(
	chainWithContext(({db, payload: rawFile}) =>
		compose(
			futureToStream,
			foldFuture(errorToAction(finishUpdateRawFile), finishUpdateRawFile),
			db.RawFile.update
		)(rawFile)
	),
	select(constants.UPDATE_RAW_FILE)
);
