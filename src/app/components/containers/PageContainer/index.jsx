import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindSelectors} from '@matthemsteger/redux-utils-fn-selectors';
import {
	selectRouteType,
	constants as routes
} from './../../../redux/modules/routing';
import HomePageContainer from './HomePageContainer';
import FirstRunPageContainer from './FirstRunPageContainer';
import WorldGenPageContainer from './WorldGenPageContainer';

const {ROUTE_HOME, ROUTE_FIRST_RUN, ROUTE_WORLDS} = routes;

function PageContainer({routeType}) {
	switch (routeType) {
		case ROUTE_HOME:
			return <HomePageContainer />;
		case ROUTE_FIRST_RUN:
			return <FirstRunPageContainer />;
		case ROUTE_WORLDS:
			return <WorldGenPageContainer />;
		default:
			return null;
	}
}

PageContainer.propTypes = {
	routeType: PropTypes.string.isRequired
};

const mapStateToProps = bindSelectors({routeType: selectRouteType});

export default connect(mapStateToProps)(PageContainer);
