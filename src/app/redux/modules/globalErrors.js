import {
	map,
	ifElse,
	identity,
	of as arrayOf,
	compose,
	without,
	concat,
	curry,
	path
} from 'ramda';
import {createConstantMap} from '@matthemsteger/redux-utils-fn-constants';
import {createPlainAction} from '@matthemsteger/redux-utils-fn-actions';
import {createReducer} from '@matthemsteger/redux-utils-fn-reducers';
import {makeErrorSerializable} from './../utils';

export const constants = createConstantMap('ADD_ERRORS', 'REMOVE_ERROR');

const makeArray = ifElse(Array.isArray, identity, arrayOf);

export function addErrors(errors) {
	const errorsToAdd = compose(
		map(makeErrorSerializable),
		makeArray
	)(errors);

	return createPlainAction(constants.ADD_ERRORS, {errors: errorsToAdd});
}

export function removeError(error) {
	return createPlainAction(constants.REMOVE_ERROR, {error});
}

const initialState = [];
export default createReducer(initialState, [
	[
		constants.ADD_ERRORS,
		curry((action, state) =>
			compose(
				concat(state),
				path(['payload', 'errors'])
			)(action)
		)
	],
	[
		constants.REMOVE_ERROR,
		curry((action, state) =>
			without(
				compose(
					arrayOf,
					path(['payload', 'error'])
				)(action)
			)(state)
		)
	]
]);
