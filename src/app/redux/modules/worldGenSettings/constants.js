import {map} from 'ramda';
import {
	createConstantMap,
	createLifecycleConstants,
	crudConstants
} from '@matthemsteger/redux-utils-fn-constants';

export default createConstantMap(
	map(createLifecycleConstants, [
		'FIND_INSTALLS_WORLD_GEN_SETTINGS',
		'PARSE_WORLD_GEN_SETTINGS',
		...crudConstants('WORLD_GEN_SETTING')
	])
);
