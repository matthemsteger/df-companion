import React, {Component} from 'react';
import {connect} from 'react-redux';

class SideNavigation extends Component {
	constructor() {
		//
	}

	render() {
		return (
			<div />
		);
	}
}

const mapStateToProps = (state) => ({dwarfFortressInstalls: state.dwarfFortressInstalls});
const mapDispatchToProps = (dispatch) => bindActionCreators({setActiveInstall, getInstalls}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SideNavigation);
