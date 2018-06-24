import R from 'ramda';
import os from 'os';

const numWorkers = os.cpus().length;
const WORKER_SOURCE = './worker/index.js';

function createBackgroundWorker(idx) {
	const worker = new Worker(WORKER_SOURCE, {name: `worker${idx}`});
	return worker;
}

export default () => R.times(createBackgroundWorker, numWorkers);

// need a way to distribute work among workers
// perhaps keep state in redux?
// best and easiest would be worker reducer
// keeps track of busy/free workers
// just choose first free or random
// need to figure out if possible to count queue in
