import R from 'ramda';
import {createConstant, createLifecycleConstants, crudConstants} from './../../utils';

export default createConstant(R.map(createLifecycleConstants, [...crudConstants('MODELED_RAW_FILE')]));
