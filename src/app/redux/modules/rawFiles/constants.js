import R from 'ramda';
import {createConstant, createLifecycleConstants, crudConstants} from './../../utils';

export default createConstant(R.map(
	createLifecycleConstants,
	[
		'WORKER_PARSE_RAW_FILE',
		'PARSE_RAW_FILE_DONE',
		'WORKER_CREATE_RAW_FILE',
		'CREATE_RAW_FILE_WORKER_DONE',
		'FIND_INSTALLS_RAW_FILES',
		...crudConstants('RAW_FILE')
	]
));
