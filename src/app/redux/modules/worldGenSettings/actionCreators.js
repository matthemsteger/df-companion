import {createActionCreator} from '@matthemsteger/redux-utils-fn-actions';
import constants from './constants';

export const findInstallsWorldGenSettings = createActionCreator(
	constants.FIND_INSTALLS_WORLD_GEN_SETTINGS
);

export const finishFindInstallsWorldGenSettings = createActionCreator(
	constants.FIND_INSTALLS_WORLD_GEN_SETTINGS_DONE
);
