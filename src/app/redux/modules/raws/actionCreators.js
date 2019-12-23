import {createActionCreator} from '@matthemsteger/redux-utils-fn-actions';
import constants from './constants';

// eslint-disable-next-line import/prefer-default-export
export const finishCreateModeledRawFile = createActionCreator(
	constants.CREATE_MODELED_RAW_FILE_DONE
);
