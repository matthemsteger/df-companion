import {combineReducers} from 'redux';
import _ from 'lodash';
import globalErrors from './modules/globalErrors';
import dwarfFortressInstalls from './modules/dwarfFortressInstalls';
import generatedWorlds from './modules/generatedWorlds';
import location from './modules/routing';
import raws from './modules/raws';
import rawFiles from './modules/rawFiles';

const reducerToModelMap = new Map();
reducerToModelMap.set(dwarfFortressInstalls, {path: 'dwarfFortressInstalls'});
reducerToModelMap.set(generatedWorlds, {path: 'generatedWorlds'});
reducerToModelMap.set(location, {path: 'location'});
reducerToModelMap.set(raws, {path: 'raws'});
reducerToModelMap.set(rawFiles, {path: 'rawFiles'});

export default combineReducers({
	globalErrors,
	dwarfFortressInstalls,
	generatedWorlds,
	raws,
	rawFiles,
	location,
	reducerToModelMap: _.constant(reducerToModelMap)
});
