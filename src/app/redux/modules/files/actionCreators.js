import {createActionCreator} from '@matthemsteger/redux-utils-fn-actions';
import constants from './constants';

export const listFiles = createActionCreator(constants.LIST_FILE);
export const finishListFiles = createActionCreator(constants.LIST_FILE_DONE);
export const createFile = createActionCreator(constants.CREATE_FILE);
export const finishCreateFile = createActionCreator(constants.CREATE_FILE_DONE);
export const updateFile = createActionCreator(constants.UPDATE_FILE);
export const finishUpdateFile = createActionCreator(constants.UPDATE_FILE_DONE);
