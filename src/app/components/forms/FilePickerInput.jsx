import React, {Component} from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import {remote} from 'electron';
import {defaults} from './../../../common/utils/objects';
import FolderIcon from './../svg/ic_folder_black_24px.svg';
import Styler from './../Styler';
import TextLikeInput from './TextLikeInput';
import Button from './../Button';

const style = {};

function makeFakeEvent(value, name) {
	return {
		target: {
			name,
			value
		},
		persist: R.always(undefined)
	};
}

export default class FilePickerInput extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		placeholder: PropTypes.string,
		pickerText: PropTypes.string.isRequired,
		pickerOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
		onChange: PropTypes.func.isRequired,
		initialValue: PropTypes.string,
		error: PropTypes.string
	};

	static defaultProps = {
		placeholder: '',
		pickerOptions: {title: 'Choose a file', properties: ['openFile']},
		initialValue: '',
		error: ''
	};

	constructor(props) {
		super(props);

		this.state = {
			path: this.props.initialValue
		};
	}

	handlePicker = (e) => {
		const {pickerOptions, name, onChange} = this.props;
		const options = defaults(pickerOptions, {
			title: 'Choose a file',
			properties: ['openFile']
		});

		const paths = remote.dialog.showOpenDialog(remote.getCurrentWindow(), options);
		const path = R.head(paths);

		if (path) {
			this.setState({path}, () => {
				onChange(makeFakeEvent(path, name), path, e);
			});
		}
	}

	render() {
		const {id, placeholder, name, pickerText, error} = this.props;
		const {path} = this.state;

		return (
			<Styler style={style}>
				{({className}) => (
					<div className={className}>
						<TextLikeInput
							id={id}
							placeholder={placeholder}
							name={name}
							value={path}
							error={error}
							readOnly
						/>
						<Button	onClick={this.handlePicker} hasIcon>
							<FolderIcon />
							{pickerText}
						</Button>
					</div>
				)}
			</Styler>
		);
	}
}
