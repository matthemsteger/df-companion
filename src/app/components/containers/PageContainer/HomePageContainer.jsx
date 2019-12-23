import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {redirect} from 'redux-first-router';
import {
	listInstalls,
	readActiveInstall,
	selectActiveInstallId,
	selectTimesInstallsFetched,
	selectInstalls
} from './../../../redux/modules/dwarfFortressInstalls';
import {
	constants as routes,
	createRouteToAction
} from './../../../redux/modules/routing';
import {bindSelectors} from './../../../redux/selectorUtilities';
import Home from './../../pages/Home';

const {ROUTE_FIRST_RUN} = routes;

class HomePage extends Component {
	static propTypes = {
		activeInstallId: PropTypes.string,
		timesInstallsFetched: PropTypes.number.isRequired,
		installs: PropTypes.array.isRequired,
		actions: PropTypes.shape({
			listInstalls: PropTypes.func.isRequired,
			readActiveInstall: PropTypes.func.isRequired,
			redirect: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {
		activeInstallId: undefined
	};

	componentDidMount() {
		const {installs, timesInstallsFetched, actions} = this.props;
		actions.listInstalls();
		actions.readActiveInstall();
		this.checkInstalls({installs, timesInstallsFetched});
	}

	componentDidUpdate() {
		this.checkInstalls(this.props);
	}

	checkInstalls = ({installs, timesInstallsFetched}) => {
		const {actions} = this.props;
		if (timesInstallsFetched > 0 && installs.length === 0) {
			actions.redirect(createRouteToAction(ROUTE_FIRST_RUN));
		}
	};

	render() {
		return <Home {...this.props} />;
	}
}

const mapStateToProps = bindSelectors({
	activeInstallId: selectActiveInstallId,
	timesInstallsFetched: selectTimesInstallsFetched,
	installs: selectInstalls
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(
		{
			listInstalls,
			redirect,
			readActiveInstall
		},
		dispatch
	)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomePage);
