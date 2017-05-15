import 'babel-polyfill';
import React from 'react';
import {AppContainer} from 'react-hot-loader';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {MemoryRouter as Router, Route} from 'react-router';
import {remote} from 'electron';
import configureStore from './redux/configureStore';
import Database from './../database';
import buildRoutes from './routes';

const filename = `${remote.app.getPath('userData')}/database.sqlite`;
const database = new Database({connection: {filename}});
const store = configureStore({database}, {});
const routes = buildRoutes(store);

const rootElement = document.getElementById('root');
const render = (appRoutes) => {
	ReactDOM.render(
		<AppContainer>
			<Provider store={store}>
				<Router>
					<div>
						<div>
							{appRoutes.map((route) =>
								(
									<Route key={route.path} path={route.path} exact={route.exact} component={route.sideNav} />
								)
							)}
						</div>
						<div>
							{appRoutes.map((route) =>
								(
									<Route key={route.path} path={route.path} exact={route.exact} component={route.main} />
								)
							)}
						</div>
					</div>
				</Router>
			</Provider>
		</AppContainer>,
		rootElement
	);
};

render(routes);

if (module.hot) {
	module.hot.accept('./routes', () => render(buildRoutes(store)));
}
