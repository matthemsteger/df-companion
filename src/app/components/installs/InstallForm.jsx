import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Formik} from '@mattvt3/formik';
import R from 'ramda';
import schema from './../../../database/schemas/dwarfFortressInstall';
import InstallFormFields from './InstallFormFields';
import Button from './../Button';

export default class InstallForm extends Component {
	static propTypes = {
		children: PropTypes.node,
		buttonText: PropTypes.string,
		submitAction: PropTypes.func.isRequired,
		checkInstallPath: PropTypes.func.isRequired,
		actionPending: PropTypes.bool.isRequired,
		checkedPaths: PropTypes.array
	};

	static defaultProps = {
		children: null,
		buttonText: 'Save',
		checkedPaths: []
	};

	state = {
		isSubmitting: false
	}

	componentWillReceiveProps(nextProps) {
		const {actionPending} = nextProps;
		const {isSubmitting} = this.state;

		if (actionPending !== isSubmitting) {
			this.setState({isSubmitting: actionPending});
		}
	}

	onSubmit = (values) => {
		const {submitAction} = this.props;
		submitAction(R.pick(['name', 'path', 'version'], values));
		this.setState({isSubmitting: true});
	}

	onChange = (handleChange, e) => {
		if (e.persist) e.persist();

		const {checkInstallPath} = this.props;
		const {name, value} = e.target;

		handleChange(e);

		if (name === 'path') {
			checkInstallPath(value);
		}
	}

	onReinitialize = (values, formikActions) => {
		const {checkedPaths} = this.props;
		const {path, version} = values;
		const {setFieldValue} = formikActions;

		const matchedPath = R.find(R.propEq('path', path), checkedPaths);
		if (matchedPath && version !== matchedPath.version) {
			setFieldValue('version', matchedPath.version);
		}
	}

	render() {
		const {children, buttonText, checkedPaths} = this.props;
		const {isSubmitting} = this.state;
		const initalValues = {
			name: '',
			path: '',
			version: '',
			checkedPaths
		};

		return (
			<Formik
				onSubmit={this.onSubmit}
				initialValues={initalValues}
				validationSchema={schema}
				enableReinitialize
				onReinitialize={this.onReinitialize}
			>
				{(formikProps) => {
					const {
						values,
						errors,
						handleSubmit,
						handleChange,
						isValid
					} = formikProps;

					return (
						<form onSubmit={handleSubmit}>
							{children}
							<InstallFormFields
								errors={errors}
								values={values}
								onChange={R.partial(this.onChange, [handleChange])}
							/>
							<Button type="submit" disabled={isSubmitting && isValid}>
								{buttonText}
							</Button>
						</form>
					);
				}}
			</Formik>
		);
	}
}
