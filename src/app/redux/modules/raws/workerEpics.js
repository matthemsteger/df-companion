import {select} from 'redux-most';
import R from 'ramda';
import {fold as foldFuture} from 'fluture';
import dfTools from 'df-tools';
import constants from './constants';
import {finishParseCreatureRaws} from './actionCreators';
import {futureToStream} from './../../epicUtilities';

export const parseCreatureRawsWorkerEpic = R.compose(
	R.chain(R.compose(
		futureToStream,
		foldFuture((err) => finishParseCreatureRaws(err, true), finishParseCreatureRaws),
		dfTools.raws.parseCreatureRaws,
		R.prop('payload')
	)),
	select(constants.WORKER_PARSE_CREATURE_RAWS)
);
