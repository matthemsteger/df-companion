import {createActionCreator} from './../../utils';
import constants from './constants';

export const createInstall = createActionCreator(constants.CREATE_INSTALL);
export const finishCreateInstall = createActionCreator(constants.CREATE_INSTALL_DONE);
export const updateInstall = createActionCreator(constants.UPDATE_INSTALL);
export const deleteInstall = createActionCreator(constants.DELETE_INSTALL);
export const finishDeleteInstall = createActionCreator(constants.DELETE_INSTALL_DONE);
export const readInstall = createActionCreator(constants.READ_INSTALL);
export const listInstalls = createActionCreator(constants.LIST_INSTALL);
export const finishListInstalls = createActionCreator(constants.LIST_INSTALL_DONE);

export const setActiveInstall = createActionCreator(constants.SET_ACTIVE_INSTALL);
export const finishSetActiveInstall = createActionCreator(constants.SET_ACTIVE_INSTALL_DONE);
export const readActiveInstall = createActionCreator(constants.READ_ACTIVE_INSTALL);
export const finishReadActiveInstall = createActionCreator(constants.READ_ACTIVE_INSTALL_DONE);

export const checkInstallPath = createActionCreator(constants.CHECK_PATH);
export const finishCheckInstallPath = createActionCreator(constants.CHECK_PATH_DONE);
