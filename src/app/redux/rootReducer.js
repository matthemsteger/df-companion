import {combineReducers} from 'redux';
import _ from 'lodash';
import globalErrors from './modules/globalErrors';
import dwarfFortressInstalls from './modules/dwarfFortressInstalls';
import generatedWorlds from './modules/generatedWorlds';

const reducerToModelMap = new Map();
reducerToModelMap.set(dwarfFortressInstalls, {path: 'dwarfFortressInstalls'});
reducerToModelMap.set(generatedWorlds, {path: 'generatedWorlds'});

export default combineReducers({
	globalErrors,
	dwarfFortressInstalls,
	generatedWorlds,
	reducerToModelMap: _.constant(reducerToModelMap)
});
