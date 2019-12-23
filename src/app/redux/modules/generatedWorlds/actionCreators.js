import {createActionCreator} from '@matthemsteger/redux-utils-fn-actions';
import constants from './constants';

export const generateWorlds = createActionCreator(constants.GENERATE_WORLDS);
export const generateWorld = createActionCreator(constants.GENERATE_WORLD);
export const createGeneratedWorld = createActionCreator(
	constants.CREATE_GENERATED_WORLD
);
export const finishCreateGeneratedWorld = createActionCreator(
	constants.CREATE_GENERATED_WORLD_DONE
);
export const createErroredGeneratedWorld = createActionCreator(
	constants.CREATE_ERRORED_GENERATED_WORLD
);
