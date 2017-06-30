import 'babel-polyfill';
import React from 'react';
import {AppContainer} from 'react-hot-loader';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {MemoryRouter as Router, Route} from 'react-router';
import {remote} from 'electron';
import {Provider as FelaProvider, ThemeProvider} from 'react-fela';
import configureStore from './redux/configureStore';
import Database from './../database';
import createStyleRenderer from './styleRenderer';
import theme from './style/theme';
import buildRoutes from './routes';
import './style/variables.scss';

const filename = `${remote.app.getPath('userData')}/database.sqlite`;
const database = new Database({connection: {filename}});
const store = configureStore({database}, {});
const routes = buildRoutes(store);

function getNextMountNode() {
	const mountNode = document.getElementById('stylesheet');
	const nextMountNode = document.createElement('style');
	nextMountNode.id = 'stylesheet';

	if (!mountNode) {
		document.head.appendChild(nextMountNode);
		return nextMountNode;
	}

	const {parentNode} = mountNode;
	parentNode.replaceChild(nextMountNode, mountNode);
	return nextMountNode;
}

const styleRenderer = createStyleRenderer();
const rootElement = document.getElementById('root');
const render = (appRoutes) => {
	ReactDOM.render(
		<AppContainer>
			<Provider store={store}>
				<FelaProvider mountNode={getNextMountNode()} renderer={styleRenderer}>
					<ThemeProvider theme={theme}>
						<Router>
							<div className="columns">
								<div className="column is-one-quarter">
									{appRoutes.map((route) =>
										(
											<Route key={route.path} path={route.path} exact={route.exact} component={route.sidebar} />
										)
									)}
								</div>
								<div className="column">
									{appRoutes.map((route) =>
										(
											<Route key={route.path} path={route.path} exact={route.exact} component={route.main} />
										)
									)}
								</div>
							</div>
						</Router>
					</ThemeProvider>
				</FelaProvider>
			</Provider>
		</AppContainer>,
		rootElement
	);
};

render(routes);

if (module.hot) {
	module.hot.accept('./routes', () => render(buildRoutes(store)));
}
