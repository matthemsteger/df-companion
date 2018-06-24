import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {selectRouteType} from './../../redux/modules/routing';
import PageSwitcher from './../pages';

function App(props) {
	const {routeType} = props;

	return (
		<div>
			<PageSwitcher routeType={routeType} />
		</div>
	);
}

App.propTypes = {
	routeType: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({routeType: selectRouteType(state)});

export default connect(mapStateToProps)(App);
