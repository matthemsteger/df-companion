import React from 'react';
import PropTypes from 'prop-types';
import Styler from './../Styler';

const styler = ({error}) => ({
	borderColor: error ? 'red' : 'black'
});

export default function TextLikeInput(props) {
	const {
		id,
		name,
		type,
		placeholder,
		onChange,
		value,
		required,
		readOnly,
		error
	} = props;

	return (
		<Styler rule={styler} error={error}>
			{({className}) => (
				<input
					id={id}
					className={className}
					name={name}
					type={type}
					placeholder={placeholder}
					onChange={onChange}
					value={value}
					required={required}
					readOnly={readOnly}
				/>
			)}
		</Styler>
	);
}

TextLikeInput.propTypes = {
	id: PropTypes.string,
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	type: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	error: PropTypes.string
};

TextLikeInput.defaultProps = {
	id: null,
	placeholder: null,
	onChange: () => undefined,
	type: 'text',
	value: '',
	required: false,
	readOnly: false,
	error: null
};
