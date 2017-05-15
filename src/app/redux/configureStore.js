import {compose, applyMiddleware, createStore} from 'redux';
import _ from 'lodash';
import rootReducer from './rootReducer';

function createCustomThunkMIddleware(api) {
	return function customThunkMiddleware({dispatch, getState}) {
		return (next) => (action) => {
			if (_.isFunction(action)) {
				return action(dispatch, getState, api);
			}

			return next(action);
		};
	};
}

export default function configureStore(api, initialState, ...middlewares) {
	const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose; // eslint-disable-line no-underscore-dangle

	const enhancer = composeEnhancers(
		applyMiddleware(createCustomThunkMIddleware(api), ...middlewares)
	);

	const store = createStore(rootReducer, initialState, enhancer);

	if (module.hot) {
		module.hot.accept('./rootReducer', () => {
			store.replaceReducer(require('./rootReducer')); // eslint-disable-line global-require
		});
	}

	return store;
}
