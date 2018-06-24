import React from 'react';
import {createComponent} from 'react-fela';
import R from 'ramda';
import PropTypes from 'prop-types';
import Styler from './../Styler';
import FieldLabel from './FieldLabel';
import HelpText from './HelpText';

const InputWrapper = createComponent(R.always({}));
const style = {};

export default function InputField(props) {
	const {
		id,
		label,
		error,
		helpText,
		children
	} = props;

	return (
		<Styler style={style}>
			{({className}) => (
				<div className={className}>
					{
						label
							? <FieldLabel htmlFor={id}>{label}</FieldLabel>
							: null
					}
					<InputWrapper>
						{children}
					</InputWrapper>
					{
						error
							? <HelpText errored>{error}</HelpText>
							: null
					}
					{
						helpText ? <HelpText>{helpText}</HelpText> : null
					}
				</div>
			)}
		</Styler>
	);
}

InputField.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	error: PropTypes.string,
	helpText: PropTypes.string,
	children: PropTypes.node.isRequired
};

InputField.defaultProps = {
	id: '',
	label: null,
	error: '',
	helpText: ''
};
