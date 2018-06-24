import R from 'ramda';
import {randomInt} from './../numbers';

export {default as calculateAddsDeletesUpdates} from './addsDeletesUpdates';
export const concatAndFlatten = R.compose(R.flatten, R.concat);
export const sample = R.converge(R.nth, [R.compose(randomInt(0), R.length), R.identity]);
