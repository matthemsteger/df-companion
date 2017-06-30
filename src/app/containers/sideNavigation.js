import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {connect as connectStyle} from 'react-fela';
import {createStyleToProps} from './../utils';
import InstallPicker from './../components/installPicker';
import WorldGenSideNavigation from './../components/worldGenSideNavigation';
import {selectInstalls, setActiveInstall, getInstalls} from './../redux/modules/dwarfFortressInstalls';
import {selectGeneratedWorlds, selectPendingGeneratedWorlds, selectErroredGeneratedWorlds, getGeneratedWorlds} from './../redux/modules/generatedWorlds';
import {bindSelectors} from './../redux/selectorUtilities';

const styles = createStyleToProps({
	sideNavigation: {fontSize: '.8rem'}
});

class SideNavigation extends Component {
	static propTypes = {
		installs: PropTypes.array.isRequired,
		getInstalls: PropTypes.func.isRequired,
		setActiveInstall: PropTypes.func.isRequired,
		getGeneratedWorlds: PropTypes.func.isRequired,
		generatedWorlds: PropTypes.array.isRequired,
		styles: PropTypes.object.isRequired
	}

	componentWillMount() {
		this.props.getInstalls();
		this.props.getGeneratedWorlds();
	}

	onInstallClick = (install, e) => {
		if (e) e.preventDefault();

		this.props.setActiveInstall(install.id);
	}

	render() {
		return (
			<nav className={`panel ${this.props.styles.sideNavigation}`}>
				<InstallPicker installs={this.props.installs} onInstallClick={this.onInstallClick} />
				<WorldGenSideNavigation generatedWorlds={this.props.generatedWorlds} />
			</nav>
		);
	}
}

const mapStateToProps = (state) => bindSelectors({
	installs: selectInstalls,
	generatedWorlds: selectGeneratedWorlds,
	pendingGeneratedWorlds: selectPendingGeneratedWorlds,
	erroredGeneratedWorlds: selectErroredGeneratedWorlds
}, state);

const mapDispatchToProps = (dispatch) => bindActionCreators({setActiveInstall, getInstalls, getGeneratedWorlds}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(connectStyle(styles)(SideNavigation));
