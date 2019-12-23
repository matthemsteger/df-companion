import {combineReducers} from 'redux';
import {compose} from 'ramda';
import {mapEnhanceReducer} from '@matthemsteger/redux-utils-fn-selectors';
import globalErrors from './modules/globalErrors';
import dwarfFortressInstalls from './modules/dwarfFortressInstalls';
import generatedWorlds from './modules/generatedWorlds';
import location from './modules/routing';
import raws from './modules/raws';
import rawFiles from './modules/rawFiles';

const reducerMap = {
	globalErrors,
	dwarfFortressInstalls,
	generatedWorlds,
	raws,
	rawFiles,
	location
};

export default compose(
	mapEnhanceReducer(reducerMap),
	combineReducers
)(reducerMap);
