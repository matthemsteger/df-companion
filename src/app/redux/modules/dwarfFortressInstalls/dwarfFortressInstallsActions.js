import _ from 'lodash';
import {createPlainAction} from './../../utils';
import * as globalErrorsActions from './../globalErrors';
import constants from './dwarfFortressInstallsConstants';

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

