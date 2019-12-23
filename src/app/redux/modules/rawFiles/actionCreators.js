import {createActionCreator} from '@matthemsteger/redux-utils-fn-actions';
import constants from './constants';

export const findRawFiles = createActionCreator(
	constants.FIND_INSTALL_RAW_FILES
);
export const finishFindRawFiles = createActionCreator(
	constants.FIND_INSTALL_RAW_FILES_DONE
);
export const createRawFile = createActionCreator(constants.CREATE_RAW_FILE);
export const parseRawFileWorker = createActionCreator(
	constants.WORKER_PARSE_RAW_FILE
);
export const finishParseRawFileWorker = createActionCreator(
	constants.PARSE_RAW_FILE_DONE
);
export const finishCreateRawFile = createActionCreator(
	constants.CREATE_RAW_FILE_DONE
);
export const deleteRawFile = createActionCreator(constants.DELETE_RAW_FILE);
export const finishDeleteRawFile = createActionCreator(
	constants.DELETE_RAW_FILE_DONE
);
export const updateRawFile = createActionCreator(constants.UPDATE_RAW_FILE);
export const finishUpdateRawFile = createActionCreator(
	constants.UPDATE_RAW_FILE_DONE
);
export const finishListRawFiles = createActionCreator(
	constants.LIST_RAW_FILE_DONE
);
