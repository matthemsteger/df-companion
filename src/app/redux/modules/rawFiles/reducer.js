import R from 'ramda';
import {handleStandardReceive, createReducer, createCompositeIdSelector, handleStandardAdd, reducerFuncWhenError, addResourceToMap, handleStandardError} from './../../utils';
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

const addToArray = R.curry(({payloadSelector = R.identity, idSelector = R.prop('id'), arrayProp}, action, state) => {
	const id = R.compose(idSelector, payloadSelector, R.prop('payload'))(action);
	return R.evolve({
		[arrayProp]: R.compose(R.uniq, R.append(id))
	})(state);
});

const removeFromArray = R.curry(({payloadSelector = R.identity, idSelector = R.prop('id'), arrayProp}, action, state) => {
	const id = R.compose(idSelector, payloadSelector, R.prop('payload'))(action);
	return R.evolve({
		[arrayProp]: R.without([id])
	})(state);
});

export default createReducer(initialState, [
	[constants.LIST_RAW_FILE_DONE, [
		handleStandardReceive({
			resourceName: rawFilesResourceName
		})
	]],
	[constants.CREATE_RAW_FILE_DONE, [
		handleStandardAdd({
			resourceName: rawFilesResourceName
		}),
		handleStandardError({
			resourceName: rawFilesResourceName
		})
	]],
	[constants.UPDATE_RAW_FILE_DONE, [
		handleStandardAdd({
			resourceName: rawFilesResourceName
		}),
		handleStandardError({
			resourceName: rawFilesResourceName
		})
	]],
	[constants.WORKER_PARSE_RAW_FILE, [
		addToArray({
			arrayProp: 'pendingRawFiles'
		})
	]],
	[constants.PARSE_RAW_FILE_DONE, [
		reducerFuncWhenError(removeFromArray({
			idSelector: R.prop('rawFileId'),
			arrayProp: 'pendingRawFiles'
		})),
		reducerFuncWhenError(addResourceToMap({
			idSelector: R.prop('rawFileId'),
			mapKey: 'rawFileParseErrorsById'
		}))
	]]
]);

// create .. add to pending (as id) so we dont try again, then goes to epic -> background to create, will handle done
// delete .. just lets pass through to delete epic, then handle done
// update .. null out the existing cache, then add to pending, handle done (what about id)
