import {flip} from 'ramda';
import {createPlainAction} from '@matthemsteger/redux-utils-fn-actions';

export {middleware, enhancer, default} from './reducer';
export * from './selectors';
export {default as constants} from './constants';
export const createRouteToAction = flip(createPlainAction)(undefined);
