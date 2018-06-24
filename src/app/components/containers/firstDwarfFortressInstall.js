import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import R from 'ramda';
import {withFormik} from 'formik';
import * as Yup from 'yup';
import {Input, FilePicker} from './../../components/fields';
import {bindSelectors} from './../../redux/selectorUtilities';
import {
	createInstall,
	checkInstallPath,
	selectCheckedPaths,
	selectCreateInstallPending,
	selectInstallsRaw
} from './../../redux/modules/dwarfFortressInstalls';

class FirstDwarfFortressInstall extends Component {
	static propTypes = {
		checkedPaths: PropTypes.array,
		createInstall: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
		checkInstallPath: PropTypes.func.isRequired,
		values: PropTypes.object.isRequired,
		touched: PropTypes.object.isRequired,
		errors: PropTypes.object.isRequired,
		setFieldValue: PropTypes.func.isRequired,
		handleChange: PropTypes.func.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		isSubmitting: PropTypes.bool.isRequired,
		setSubmitting: PropTypes.func.isRequired,
		createInstallPending: PropTypes.bool.isRequired,
		onSave: PropTypes.func,
		installs: PropTypes.array.isRequired,
		handleBlur: PropTypes.func.isRequired
	};

	static defaultProps = {
		onSave: _.noop,
		checkedPaths: []
	};

	constructor(props, context) {
		super(props, context);

		this.state = {
			uniqueId: _.uniqueId('fdfi')
		};
	}

	componentWillReceiveProps(nextProps) {
		const {
			checkedPaths,
			createInstallPending,
			values: {version, path},
			isSubmitting
		} = nextProps;
		if (isSubmitting !== createInstallPending) {
			this.props.setSubmitting(createInstallPending);
		}

		const matchedPath = R.find(R.propEq('path', path), checkedPaths);
		if (matchedPath && version !== matchedPath.version) {
			this.props.setFieldValue('version', matchedPath.version);
		}

		// we need to check to see if the install was created successfully
		// if it was, then we can fire a prop callback to notify consumers
		// of this container that it was done
	}

	componentDidUpdate() {
		const {
			installs,
			values: {path}
		} = this.props;
		const addedInstall = R.find(R.propEq('path', path), installs);
		if (addedInstall) {
			this.props.onSave(addedInstall);
		}
	}

	handleFilePickerChange = (e) => {
		this.props.setFieldValue(e.name, e.value);
		this.props.checkInstallPath(e.value);
	};

	render() {
		const {
			handleSubmit,
			handleChange,
			handleBlur,
			isSubmitting,
			values,
			touched,
			errors
		} = this.props;
		const {uniqueId} = this.state;
		const pickerOptions = {
			title: 'Choose a directory',
			properties: ['openDirectory']
		};

		return (
			<form onSubmit={handleSubmit}>
				<h3 className="title">
					Add your first Dwarf Fortress installation
				</h3>
				<Input
					type="text"
					name="name"
					label="Name"
					placeholder="Name your install"
					onChange={handleChange}
					error={touched.name && errors.name}
					onBlur={handleBlur}
					value={values.name}
				/>
				<label className="label" htmlFor={`${uniqueId}path`}>
					Install Path
				</label>
				<FilePicker
					id={`${uniqueId}path`}
					name="path"
					placeholder="Install Path"
					pickerText="Choose Directory"
					onChange={this.handleFilePickerChange}
					initialValue={this.state.path}
					helpText="The directory that you have installed Dwarf Fortress"
					pickerOptions={pickerOptions}
				/>
				<Input
					type="text"
					name="version"
					label="Version"
					placeholder="Version"
					onChange={handleChange}
					onBlur={handleBlur}
					value={values.version}
					error={touched.version && errors.version}
				/>
				<br />
				<button
					className="button is-primary"
					type="submit"
					disabled={isSubmitting}
				>
					Save
				</button>
			</form>
		);
	}
}

const formikOptions = {
	mapPropsToValues() {
		return {
			name: '',
			path: '',
			version: ''
		};
	},
	validationSchema: Yup.object().shape({
		name: Yup.string().required(),
		path: Yup.string().required(
			'You must enter a valid path to a Dwarf Fortress install'
		),
		version: Yup.string().required()
	}),
	handleSubmit(values, {props}) {
		props.createInstall(R.pick(['name', 'path', 'version'], values));
	}
};

const mapStateToProps = bindSelectors({
	checkedPaths: selectCheckedPaths,
	createInstallPending: selectCreateInstallPending,
	installs: selectInstallsRaw
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators({createInstall, checkInstallPath}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withFormik(formikOptions)(FirstDwarfFortressInstall));
