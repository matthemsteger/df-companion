import React from 'react';
import PropTypes from 'prop-types';
import Styler from './Styler';

const styler = ({hasIcon}) => ({
	display: hasIcon ? 'flex' : 'inline-block'
});

export default function Button({hasIcon, type, onClick, disabled, children}) {
	return (
		<Styler rule={styler} hasIcon={hasIcon}>
			{({className}) => (
				<button
					className={className}
					type={type}
					onClick={onClick}
					disabled={disabled}
				>
					{children}
				</button>
			)}
		</Styler>
	);
}

Button.propTypes = {
	hasIcon: PropTypes.bool,
	type: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node,
	disabled: PropTypes.bool
};

Button.defaultProps = {
	hasIcon: false,
	type: 'button',
	children: null,
	onClick: null,
	disabled: false
};
