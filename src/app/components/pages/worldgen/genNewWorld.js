import React from 'react';
import PropTypes from 'prop-types';
import GenerateNewWorld from './../../containers/generateNewWorld';

function createOnGenerateHandler(history) {
	return function onGenerate() {
		history.push('/worldgen');
	};
}

export default function GenNewWorldPage({history}) {
	return (
		<GenerateNewWorld onGenerate={createOnGenerateHandler(history)} />
	);
}

GenNewWorldPage.propTypes = {
	history: PropTypes.object.isRequired
};
