import 'babel-polyfill';
import {remote} from 'electron';
import React from 'react';
// import {AppContainer} from 'react-hot-loader';
import ReactDOM from 'react-dom';
import App from './components/containers/App';
import configureStore from './redux/configureStore';
import createDatabase from './../database';
import createStyleRenderer from './styleRenderer';
import theme from './style/theme';

const filename = `${remote.app.getPath('userData')}/df-db`;
const database = createDatabase({path: filename});
const store = configureStore({database}, {});

const styleRenderer = createStyleRenderer();
const rootElement = document.getElementById('root');
const render = () => {
	ReactDOM.render(
		<App store={store} styleRenderer={styleRenderer} theme={theme} />,
		rootElement
	);
};

render();
