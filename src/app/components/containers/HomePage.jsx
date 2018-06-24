import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {redirect} from 'redux-first-router';
import {listInstalls, readActiveInstall, selectActiveInstallId, selectTimesInstallsFetched, selectInstalls} from './../../redux/modules/dwarfFortressInstalls';
import {constants as routes, createRouteToAction} from './../../redux/modules/routing';
import {bindSelectors} from './../../redux/selectorUtilities';
import Home from './../pages/Home';

const {ROUTE_FIRST_RUN} = routes;

class HomePage extends Component {
	static propTypes = {
		activeInstallId: PropTypes.string,
		listInstalls: PropTypes.func.isRequired,
		readActiveInstall: PropTypes.func.isRequired,
		timesInstallsFetched: PropTypes.number.isRequired,
		installs: PropTypes.array.isRequired,
		redirect: PropTypes.func.isRequired
	};

	static defaultProps = {
		activeInstallId: undefined
	};

	componentDidMount() {
		const {installs, timesInstallsFetched} = this.props;
		this.props.listInstalls();
		this.props.readActiveInstall();
		this.checkInstalls({installs, timesInstallsFetched});
	}

	componentDidUpdate() {
		this.checkInstalls(this.props);
	}

	checkInstalls = ({installs, timesInstallsFetched}) => {
		if (timesInstallsFetched > 0 && installs.length === 0) {
			this.props.redirect(createRouteToAction(ROUTE_FIRST_RUN));
		}
	}

	render() {
		return (
			<Home {...this.props} />
		);
	}
}

const mapStateToProps = (state) => bindSelectors({
	activeInstallId: selectActiveInstallId,
	timesInstallsFetched: selectTimesInstallsFetched,
	installs: selectInstalls
}, state);

const mapDispatchToProps = (dispatch) => bindActionCreators({
	listInstalls,
	redirect,
	readActiveInstall
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
