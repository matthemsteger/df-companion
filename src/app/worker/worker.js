/**
 * The worker entry point is the unified background worker process using WebWorker
 * Essentially all it does is listen for actions, apply them to worker epics and then
 * spit out actions
 */

// import {ipcRenderer} from 'electron';
import 'babel-polyfill';
import R from 'ramda';
import {fromEvent, observe, switchLatest, map, just as streamOf} from 'most';
import serializeError from 'serialize-error';
// import {create} from 'most-subject';
// import {WORKER_CHANNEL_IN, WORKER_CHANNEL_OUT} from './../../common/channels';
import rootWorkerEpic from './../redux/rootWorkerEpics';

// const $actions = fromEvent(WORKER_CHANNEL_IN, ipcRenderer)
// 	.map(([, action]) => action)
// 	.tap((action) => console.log('Worker received action %O', action));

// const callNextEpic = (epic) => epic($actions);

// const $actionsOut = switchLatest(map(callNextEpic, streamOf(rootWorkerEpic)));
// observe((action) => ipcRenderer.send(WORKER_CHANNEL_OUT, action), $actionsOut);

const $actions = fromEvent('message', self) // eslint-disable-line no-restricted-globals
	.map(R.prop('data'))
	.tap((action) => console.log('Worker received action %O', action));

const callNextEpic = (epic) => epic($actions);
const cleanIfError = R.when(R.propEq('error', true), R.evolve({payload: serializeError}));
const $actionsOut = map(cleanIfError, switchLatest(map(callNextEpic, streamOf(rootWorkerEpic))));
observe((action) => self.postMessage(action), $actionsOut); // eslint-disable-line no-restricted-globals
