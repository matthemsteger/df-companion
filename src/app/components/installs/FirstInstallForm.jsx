import React from 'react';
import {createComponent} from 'react-fela';
import R from 'ramda';
import PropTypes from 'prop-types';
import InstallForm from './InstallForm';

const FirstInstallHeader = createComponent(R.always({}), 'h1');

export default function FirstInstallForm(props) {
	const {submitAction, checkInstallPath, actionPending, checkedPaths} = props;
	return (
		<InstallForm
			submitAction={submitAction}
			checkInstallPath={checkInstallPath}
			actionPending={actionPending}
			checkedPaths={checkedPaths}
		>
			<FirstInstallHeader>Add your first Dwarf Fortress installation</FirstInstallHeader>
		</InstallForm>
	);
}

FirstInstallForm.propTypes = {
	submitAction: PropTypes.func.isRequired,
	checkInstallPath: PropTypes.func.isRequired,
	actionPending: PropTypes.bool.isRequired,
	checkedPaths: PropTypes.array
};

FirstInstallForm.defaultProps = {
	checkedPaths: []
};
