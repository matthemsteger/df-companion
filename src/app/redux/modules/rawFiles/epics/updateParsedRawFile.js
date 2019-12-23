import {chain, compose, ifElse, always, prop} from 'ramda';
import {select} from 'redux-most';
import {empty, just as streamOf} from 'most';
import {actionIsErrored} from '@matthemsteger/redux-utils-fn-actions';
import {updateRawFile} from './../actionCreators';
import constants from './../constants';

export default compose(
	chain(
		compose(
			ifElse(
				actionIsErrored,
				always(empty()),
				compose(
					streamOf,
					updateRawFile,
					prop('payload')
				)
			)
		)
	),
	select(constants.PARSE_RAW_FILE_DONE)
);
