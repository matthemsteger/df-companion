import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import {setActiveInstall, getInstalls} from './../redux/modules/dwarfFortressInstalls';

class HomePage extends Component {
	static propTypes = {
		dwarfFortressInstalls: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		setActiveInstall: PropTypes.func.isRequired,
		getInstalls: PropTypes.func.isRequired
	}

	componentWillMount() {
		this.props.getInstalls().then(() => {
			if (this.props.dwarfFortressInstalls.activeInstallId === undefined) {
				if (this.props.dwarfFortressInstalls.installs.length > 0) {
					this.props.setActiveInstall(_.head(this.props.dwarfFortressInstalls.installs));
				} else {
					this.props.history.replace('/first-run');
				}
			}
		});
	}

	render() {
		return (
			<h1>Home! with install {this.props.dwarfFortressInstalls.activeInstallId}</h1>
		);
	}
}

const mapStateToProps = (state) => ({dwarfFortressInstalls: state.dwarfFortressInstalls});
const mapDispatchToProps = (dispatch) => bindActionCreators({setActiveInstall, getInstalls}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
