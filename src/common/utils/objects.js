import R from 'ramda';

export const aliasProp = R.curry((prop, newProp, obj) => ({...obj, [newProp]: obj[prop]}));
export const defaults = R.flip(R.merge);
