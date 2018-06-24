import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import R from 'ramda';
import {bindSelectors} from './../../redux/selectorUtilities';
import {createInstall, checkInstallPath, selectCheckedPaths, selectCreateInstallPending, selectInstalls} from './../../redux/modules/dwarfFortressInstalls';
import InstallForm from './../installs/InstallForm';

class CreateInstallContainer extends Component {
	static propTypes = {
		children: PropTypes.node,
		checkedPaths: PropTypes.array.isRequired,
		createInstallPending: PropTypes.bool.isRequired,
		installs: PropTypes.array.isRequired,
		createInstall: PropTypes.func.isRequired,
		checkInstallPath: PropTypes.func.isRequired,
		onSave: PropTypes.func
	};

	static defaultProps = {
		children: null,
		onSave: R.always(undefined)
	};

	state = {
		submittedPath: ''
	}

	componentDidUpdate() {
		const {installs} = this.props;
		const {submittedPath} = this.state;
		const addedInstall = R.find(R.propEq('path', submittedPath), installs);
		if (addedInstall) {
			this.props.onSave(addedInstall);
		}
	}

	submitAction = (install) => {
		const {createInstall: submitAction} = this.props;
		const {path: submittedPath} = install;
		submitAction(install);
		this.setState({submittedPath});
	}

	render() {
		const {
			children,
			checkInstallPath: checkInstallPathAction,
			checkedPaths,
			createInstallPending
		} = this.props;

		return (
			<InstallForm
				buttonText="Save"
				submitAction={this.submitAction}
				checkInstallPath={checkInstallPathAction}
				actionPending={createInstallPending}
				checkedPaths={checkedPaths}
			>
				{children}
			</InstallForm>
		);
	}
}

const mapStateToProps = bindSelectors({
	checkedPaths: selectCheckedPaths,
	createInstallPending: selectCreateInstallPending,
	installs: selectInstalls
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
	createInstall,
	checkInstallPath
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CreateInstallContainer);
