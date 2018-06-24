import R from 'ramda';
import {createConstant, createLifecycleConstants, crudConstants} from './../../utils';

export default createConstant(
	R.map(createLifecycleConstants, crudConstants('INSTALL')),
	'SET_ACTIVE_INSTALL',
	'SET_ACTIVE_INSTALL_DONE',
	R.map(createLifecycleConstants, ['CHECK_PATH', 'READ_ACTIVE_INSTALL'])
);
