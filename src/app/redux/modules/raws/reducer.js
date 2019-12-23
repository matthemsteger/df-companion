import {curry, compose, prop, head} from 'ramda';
import dfTools from 'df-tools';
import {
	handleStandardReceive,
	createReducer,
	whenNoError,
	reducerWithPredicate
} from '@matthemsteger/redux-utils-fn-reducers';
import {createCompositeIdSelector} from './../../utils';
import constants from './constants';

const {rawFileTypes} = dfTools.raws;

const compositeRawIdSelector = createCompositeIdSelector(['id', 'installId']);

const initialState = {
	creaturesById: {},
	creatures: [],
	unknownById: {},
	unknowns: [],
	creaturesStatusByInstallId: {},
	creaturesErrorByInstallId: {}
};

const creaturesResourceName = 'creatures';
const unsupportedResourceName = 'unknown';

function determineResourceName(rawFileType) {
	switch (rawFileType) {
		case rawFileTypes.CREATURE:
			return creaturesResourceName;
		default:
			return unsupportedResourceName;
	}
}

const createRawStandardReceive = curry((action, state) => {
	const {payload: rawObjects} = action;
	const rawFileType = compose(
		prop('rawFileType'),
		head
	)(rawObjects);
	if (!rawFileType) return state;

	return handleStandardReceive({
		resourceName: determineResourceName(rawFileType),
		idSelector: compositeRawIdSelector
	})(action, state);
});

export default createReducer(initialState, [
	[
		constants.CREATE_MODELED_RAW_FILE_DONE,
		[reducerWithPredicate(whenNoError, createRawStandardReceive)]
	]
]);
