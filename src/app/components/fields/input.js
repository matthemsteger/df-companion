import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class Input extends Component {
	static propTypes = {
		label: PropTypes.string,
		placeholder: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func,
		type: PropTypes.string,
		defaultValue: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		])
	}

	static defaultProps = {
		label: null,
		placeholder: null,
		onChange: _.noop,
		name: null,
		type: 'text',
		defaultValue: undefined
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			value: '',
			valid: null,
			uniqueId: _.uniqueId('textInput')
		};
	}

	handleChange = (e) => {
		const {value} = e.target;
		this.setState({value}, () => {
			this.props.onChange({name: this.props.name, value}, e);
		});
	}

	render() {
		return (
			<div className="field">
				{
					this.props.label ?
						<label htmlFor={this.state.uniqueId} className="label">{this.props.label}</label>
					: null
				}
				<p className="control">
					<input
						className="input"
						name={this.props.name}
						type={this.props.type}
						placeholder={this.props.placeholder}
						onChange={this.handleChange}
						defaultValue={this.props.defaultValue}
					/>
				</p>
			</div>
		);
	}
}
