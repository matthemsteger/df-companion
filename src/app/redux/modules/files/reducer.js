import {
	handleStandardAdd,
	handleStandardReceive,
	handleStandardError,
	handleStandardRemove,
	createReducer
} from '@matthemsteger/redux-utils-fn-reducers';
import constants from './constants';

const resourceName = 'files';

const initialState = {
	[`${resourceName}ById`]: {},
	[resourceName]: [],
	[`${resourceName}Error`]: null
};

export default createReducer(initialState, [
	[constants.LIST_FILE_DONE, [handleStandardReceive({resourceName})]],
	[
		constants.CREATE_FILE_DONE,
		[handleStandardAdd({resourceName}), handleStandardError({resourceName})]
	],
	[
		constants.UPDATE_FILE_DONE,
		[handleStandardAdd({resourceName}), handleStandardError({resourceName})]
	],
	[
		constants.DELETE_FILE_DONE,
		[
			handleStandardRemove({resourceName}),
			handleStandardError({resourceName})
		]
	]
]);
