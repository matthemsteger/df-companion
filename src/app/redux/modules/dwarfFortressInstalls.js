import _ from 'lodash';
import {createConstant, createPlainAction, handleStandardAdd, handleStandardRemove, handleStandardReceive} from './../utils';
import * as globalErrorsActions from './globalErrors';

export const constants = createConstant('ADD_INSTALL', 'REMOVE_INSTALL', 'RECEIVE_INSTALLS', 'SET_ACTIVE_INSTALL');

export function addInstall(install) {
	return async function addInstallThunk(dispatch, getState, {database}) {
		try {
			const addedInstall = await database.model.DwarfFortressInstall.insert(install);
			dispatch(createPlainAction(constants.ADD_INSTALL, {install: addedInstall}));
			return addedInstall;
		} catch (err) {
			dispatch(globalErrorsActions.addErrors(err));
			return undefined;
		}
	};
}

export function removeInstall(installId) {
	return async function removeInstallThunk(dispatch, getState, {database}) {
		try {
			const numRemoved = await database.model.DwarfFortressInstall.deleteById(installId);
			if (numRemoved > 0) {
				dispatch(createPlainAction(constants.REMOVE_INSTALL, {installId}));
			}

			return numRemoved;
		} catch (err) {
			dispatch(globalErrorsActions.addErrors(err));
			return undefined;
		}
	};
}

export function getInstalls() {
	return async function getInstallsThunk(dispatch, getState, {database}) {
		try {
			const installs = await database.model.DwarfFortressInstall.getAll({eager: 'activeInstall'});
			dispatch(createPlainAction(constants.RECEIVE_INSTALLS, {installs}));
			const activeInstall = _.find(installs, ['activeInstall.id', 0]);
			if (activeInstall && activeInstall.id !== getState().dwarfFortressInstalls.activeInstallId) {
				dispatch(createPlainAction(constants.SET_ACTIVE_INSTALL, {installId: activeInstall.id}));
			}
			return installs;
		} catch (err) {
			dispatch(globalErrorsActions.addErrors(err));
			return [];
		}
	};
}

export function setActiveInstall(installId) {
	return async function setActiveInstallThunk(dispatch, getState, {database}) {
		try {
			const activeInstall = await database.model.DwarfFortressInstall.setActiveInstall(installId);
			dispatch(createPlainAction(constants.SET_ACTIVE_INSTALL, {installId}));
			return activeInstall;
		} catch (err) {
			dispatch(globalErrorsActions.addErrors(err));
			return undefined;
		}
	};
}

const initialState = {
	installsById: {},
	installs: [],
	activeInstallId: undefined
};

const resourceName = 'installs';

export default function installsReducer(state = initialState, action) {
	switch (action.type) {
		case constants.ADD_INSTALL:
			if (action.payload.install) {
				return handleStandardAdd({state, id: action.payload.install.id, resource: action.payload.install, resourceName});
			}

			return state;
		case constants.REMOVE_INSTALL:
			if (_.has(action, 'payload.installId')) {
				return handleStandardRemove({state, id: action.payload.installId, resourceName});
			}

			return state;
		case constants.RECEIVE_INSTALLS:
			if (_.isArray(action.payload.installs)) {
				return handleStandardReceive({state, idProp: 'id', resources: action.payload.installs, resourceName});
			}

			return state;
		case constants.SET_ACTIVE_INSTALL:
			if (_.has(action, 'payload.installId')) {
				return _.assign({}, state, {
					activeInstallId: action.payload.installId
				});
			}

			return state;
		default:
			return state;
	}
}
