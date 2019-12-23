import {map} from 'ramda';
import {
	createConstantMap,
	createLifecycleConstants,
	crudConstants
} from '@matthemsteger/redux-utils-fn-constants';

export default createConstantMap(
	map(createLifecycleConstants, [...crudConstants('MODELED_RAW_FILE')])
);
