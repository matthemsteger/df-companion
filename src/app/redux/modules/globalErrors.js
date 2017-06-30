import _ from 'lodash';
import R from 'ramda';
import {createConstant, createPlainAction, makeErrorSerializable} from './../utils';

export const constants = createConstant('ADD_ERRORS', 'REMOVE_ERROR');

const makeArray = R.ifElse(_.isArray, R.identity, R.of);

export function addErrors(errors) {
	const errorsToAdd = R.compose(
		R.map(makeErrorSerializable),
		makeArray
	)(errors);

	return createPlainAction(constants.ADD_ERRORS, {errors: errorsToAdd});
}

export function removeError(error) {
	return createPlainAction(constants.REMOVE_ERROR, {error});
}

export default function globalErrorsReducer(state = [], action) {
	switch (action.type) {
		case constants.ADD_ERRORS:
			return [...state, ...action.payload.errors];
		case constants.REMOVE_ERROR:
			return _.without(state, action.payload.error);
		default:
			return state;
	}
}
