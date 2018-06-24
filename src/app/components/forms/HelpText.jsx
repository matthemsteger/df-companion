import React from 'react';
import PropTypes from 'prop-types';
import Styler from './../Styler';

const rule = ({errored}) => ({
	color: errored ? 'red' : 'black'
});

export default function HelpText({errored, children}) {
	return (
		<Styler rule={rule} errored={errored}>
			{({className}) => (
				<p className={className}>{children}</p>
			)}
		</Styler>
	);
}

HelpText.propTypes = {
	errored: PropTypes.bool,
	children: PropTypes.node
};

HelpText.defaultProps = {
	errored: false,
	children: null
};
