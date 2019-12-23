import {map} from 'ramda';
import {
	createConstantMap,
	createLifecycleConstants,
	crudConstants
} from '@matthemsteger/redux-utils-fn-constants';

export default createConstantMap(
	map(createLifecycleConstants, crudConstants('PENDING_GENERATED_WORLD')),
	map(createLifecycleConstants, crudConstants('GENERATED_WORLD')),
	'CREATE_WORLD_SITES_AND_POPS',
	'GENERATE_WORLD',
	'GENERATE_WORLDS',
	'CANCEL_PENDING_GENERATED_WORLD'
);
