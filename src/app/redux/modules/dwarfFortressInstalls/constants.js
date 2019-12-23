import {map} from 'ramda';
import {
	createConstantMap,
	createLifecycleConstants,
	crudConstants
} from '@matthemsteger/redux-utils-fn-constants';

export default createConstantMap(
	map(createLifecycleConstants, crudConstants('INSTALL')),
	'SET_ACTIVE_INSTALL',
	'SET_ACTIVE_INSTALL_DONE',
	map(createLifecycleConstants, ['CHECK_PATH', 'READ_ACTIVE_INSTALL'])
);
