import {map} from 'ramda';
import {
	crudConstants,
	createConstantMap,
	createLifecycleConstants
} from '@matthemsteger/redux-utils-fn-constants';

export default createConstantMap(
	map(createLifecycleConstants, crudConstants('FILE'))
);
