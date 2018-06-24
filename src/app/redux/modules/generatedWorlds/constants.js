import R from 'ramda';
import {createConstant, createLifecycleConstants, crudConstants} from './../../utils';

export default createConstant(
	R.map(createLifecycleConstants, crudConstants('PENDING_GENERATED_WORLD')),
	R.map(createLifecycleConstants, crudConstants('GENERATED_WORLD')),
	'CREATE_WORLD_SITES_AND_POPS',
	'GENERATE_WORLD',
	'GENERATE_WORLDS',
	'CANCEL_PENDING_GENERATED_WORLD'
);
