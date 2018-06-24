import R from 'ramda';
import {compose, applyMiddleware, createStore} from 'redux';
import {createEpicMiddleware} from 'redux-most';
import {fromEvent as _fromEvent, observe as _observe} from 'most';
import {remote} from 'electron';
import isObservable from 'is-observable';
import rootReducer from './rootReducer';
import rootEpic from './rootEpic';
import {enhancer as routingEnhancer, middleware as routingMiddleware} from './modules/routing';
import createBackgroundWorkers from './../createBackgroundWorkers';
import {sample} from './../../common/utils/lists';

const fromEvent = R.curryN(2, _fromEvent);
const observe = R.curry(_observe);
const backgroundWorkers = createBackgroundWorkers();
const appRoot = `${remote.app.getPath('userData')}`;

function sendToWorker(action) {
	const randomWorker = sample(backgroundWorkers);
	randomWorker.postMessage(action);
	return action;
}

const augmentAction = R.curry((getApi, getState, action) => R.mergeDeepRight({meta: {getApi, getState, sendToWorker, appRoot}}, action));

const apiMiddleware = (api) => {
	const getApi = R.always(api);
	return (store) => (next) => (action) => {
		if (!isObservable(action)) {
			console.log(action);
			const {getState} = store;
			R.compose(next, augmentAction(getApi, getState))(action);
		} else {
			next(action);
		}
	};
};


export default function configureStore(api, initialState, ...middlewares) {
	const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose; // eslint-disable-line no-underscore-dangle

	const epicMiddleware = createEpicMiddleware(rootEpic);
	const enhancer = composeEnhancers(
		routingEnhancer,
		applyMiddleware(apiMiddleware(api), epicMiddleware, routingMiddleware, ...middlewares)
	);

	const store = createStore(rootReducer, initialState, enhancer);
	R.forEach(R.compose(observe(R.compose(store.dispatch, R.prop('data'))), fromEvent('message')), backgroundWorkers);

	if (module.hot) {
		module.hot.accept('./rootReducer', () => {
			store.replaceReducer(require('./rootReducer').default); // eslint-disable-line global-require
		});

		module.hot.accept('./rootEpic', () => {
			epicMiddleware.replaceEpic(require('./rootEpic').default); // eslint-disable-line global-require
		});
	}

	return store;
}
