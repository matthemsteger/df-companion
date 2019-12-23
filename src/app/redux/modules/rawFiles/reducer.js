import {evolve, identity, curry, prop, compose, without} from 'ramda';
import {
	handleStandardAdd,
	handleStandardReceive,
	handleStandardError,
	createReducer,
	reducerWithPredicate,
	whenError,
	addResourceToArray,
	addResourceToMap
} from '@matthemsteger/redux-utils-fn-reducers';
import constants from './constants';

const initialState = {
	rawFilesById: {},
	rawFiles: [],
	rawFilesError: null,
	combinedHashesByInstallId: {},
	combinedHashsErrorsByInstallId: {},
	pendingRawFiles: [],
	rawFileParseErrorsById: {}
};

const rawFilesResourceName = 'rawFiles';

const removeFromArray = curry(
	(
		{payloadSelector = identity, idSelector = prop('id'), mapKey},
		action,
		state
	) => {
		const id = compose(
			idSelector,
			payloadSelector,
			prop('payload')
		)(action);
		return evolve({
			[mapKey]: without([id])
		})(state);
	}
);

export default createReducer(initialState, [
	[
		constants.LIST_RAW_FILE_DONE,
		[
			handleStandardReceive({
				resourceName: rawFilesResourceName
			})
		]
	],
	[
		constants.CREATE_RAW_FILE_DONE,
		[
			handleStandardAdd({
				resourceName: rawFilesResourceName
			}),
			handleStandardError({
				resourceName: rawFilesResourceName
			})
		]
	],
	[
		constants.UPDATE_RAW_FILE_DONE,
		[
			handleStandardAdd({
				resourceName: rawFilesResourceName
			}),
			handleStandardError({
				resourceName: rawFilesResourceName
			})
		]
	],
	[
		constants.WORKER_PARSE_RAW_FILE,
		[
			addResourceToArray({
				mapKey: 'pendingRawFiles'
			})
		]
	],
	[
		constants.PARSE_RAW_FILE_DONE,
		[
			reducerWithPredicate(
				whenError,
				removeFromArray({
					idSelector: prop('rawFileId'),
					mapKey: 'pendingRawFiles'
				})
			),
			reducerWithPredicate(
				whenError,
				addResourceToMap({
					idSelector: prop('rawFileId'),
					mapKey: 'rawFileParseErrorsById'
				})
			)
		]
	]
]);
