import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {Provider as FelaProvider, ThemeProvider} from 'react-fela';
import PageContainer from './PageContainer';

export default function App({store, styleRenderer, theme}) {
	return (
		<Provider store={store}>
			<FelaProvider renderer={styleRenderer}>
				<ThemeProvider theme={theme}>
					<PageContainer />
				</ThemeProvider>
			</FelaProvider>
		</Provider>
	);
}

App.propTypes = {
	store: PropTypes.object.isRequired,
	styleRenderer: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};
