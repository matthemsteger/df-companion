import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import PageLayout from './../PageLayout';
import {
	constants as routes,
	createRouteToAction
} from './../../redux/modules/routing';

const {ROUTE_WORLDS} = routes;

export default function Home({activeInstallId}) {
	return (
		<PageLayout sideNavigation={null}>
			<h1>Home with install {activeInstallId}</h1>
			<p>
				<Link to={createRouteToAction(ROUTE_WORLDS)}>Worlds</Link>
			</p>
		</PageLayout>
	);
}

Home.propTypes = {
	activeInstallId: PropTypes.string
};

Home.defaultProps = {
	activeInstallId: null
};
