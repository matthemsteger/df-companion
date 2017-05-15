import React from 'react';
import PropTypes from 'prop-types';
import FirstDwarfFortressInstall from './../containers/firstDwarfFortressInstall';

function createOnsaveHandler(history) {
	return function onSave() {
		history.replace('/');
	};
}

export default function FirstRun({history}) {
	return (
		<FirstDwarfFortressInstall onSave={createOnsaveHandler(history)} />
	);
}

FirstRun.propTypes = {
	history: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};
