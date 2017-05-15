import _ from 'lodash';
import {createConstant, createPlainAction} from './../utils';

export const constants = createConstant('ADD_ERRORS', 'REMOVE_ERROR');

export function addErrors(errors) {
	return createPlainAction(constants.ADD_ERRORS, {errors});
}

export function removeError(error) {
	return createPlainAction(constants.REMOVE_ERROR, {error});
}

function makeArray(errors) {
	if (!_.isArray(errors)) {
		return [errors];
	}

	return errors;
}

export default function globalErrorsReducer(state = [], action) {
	switch (action.type) {
		case constants.ADD_ERRORS:
			return [...state, ...makeArray(action.payload.errors)];
		case constants.REMOVE_ERROR:
			return _.without(state, action.payload.error);
		default:
			return state;
	}
}
