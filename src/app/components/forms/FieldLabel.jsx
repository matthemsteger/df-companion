import React from 'react';
import PropTypes from 'prop-types';
import Styler from './../Styler';

const style = {};

export default function FieldLabel({uniqueId, children}) {
	return (
		<Styler style={style}>
			{({className}) => (
				<label
					className={className}
					htmlFor={uniqueId}
				>
					{children}
				</label>
			)}
		</Styler>
	);
}

FieldLabel.propTypes = {
	uniqueId: PropTypes.string,
	children: PropTypes.node
};

FieldLabel.defaultProps = {
	uniqueId: null,
	children: null
};
