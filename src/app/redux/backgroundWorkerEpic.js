import {filter as _filter, empty} from 'most';
import R from 'ramda';
import {chainWithContext} from './epicUtilities';

const filter = R.curry(_filter);

const cleanMeta = R.evolve({meta: R.pick(['appRoot'])});
const cleanAction = R.compose(R.pick(['payload', 'error', 'type', 'meta']), cleanMeta);

export default R.compose(
	chainWithContext(({action, sendToWorker}) => {
		R.compose(sendToWorker, cleanAction)(action);
		return empty();
	}),
	filter(({type}) => type.startsWith('WORKER_'))
);
