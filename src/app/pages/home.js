import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import {setActiveInstall, getInstalls, selectInstalls, selectActiveInstallId} from './../redux/modules/dwarfFortressInstalls';
import {bindSelectors} from './../redux/selectorUtilities';

class HomePage extends Component {
	static propTypes = {
		dwarfFortressInstalls: PropTypes.array.isRequired,
		activeInstallId: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
		history: PropTypes.object.isRequired,
		setActiveInstall: PropTypes.func.isRequired,
		getInstalls: PropTypes.func.isRequired
	}

	static defaultProps = {
		activeInstallId: undefined
	}

	componentWillMount() {
		this.props.getInstalls().then(() => {
			if (this.props.activeInstallId === undefined) {
				if (this.props.dwarfFortressInstalls.length > 0) {
					this.props.setActiveInstall(_.head(this.props.dwarfFortressInstalls.installs));
				} else {
					this.props.history.replace('/first-run');
				}
			}
		});
	}

	render() {
		return (
			<h1>Home! with install {this.props.activeInstallId}</h1>
		);
	}
}

const mapStateToProps = (state) => bindSelectors({
	dwarfFortressInstalls: selectInstalls,
	activeInstallId: selectActiveInstallId
}, state);

const mapDispatchToProps = (dispatch) => bindActionCreators({setActiveInstall, getInstalls}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
