import React from 'react';
import PropTypes from 'prop-types';
import {constants} from './../../redux/modules/routing';
import HomePage from './../containers/HomePage';
import FirstRunPage from './FirstRun';
import WorldGenPage from './worldgen';

const {ROUTE_HOME, ROUTE_FIRST_RUN, ROUTE_WORLDS} = constants;

export default function PageSwitcher({routeType}) {
	switch (routeType) {
		case ROUTE_HOME:
			return (<HomePage />);
		case ROUTE_FIRST_RUN:
			return (<FirstRunPage />);
		case ROUTE_WORLDS:
			return (<WorldGenPage />);
		default:
			return null;
	}
}

PageSwitcher.propTypes = {
	routeType: PropTypes.string.isRequired
};
