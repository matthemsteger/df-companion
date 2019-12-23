import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withFormik} from 'formik';
import R from 'ramda';
import schema from './../../../database/schemas/dwarfFortressInstall';
import InstallFormFields from './InstallFormFields';
import Button from './../Button';

class InstallForm extends Component {
	static propTypes = {
		children: PropTypes.node,
		buttonText: PropTypes.string,
		submitAction: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
		checkInstallPath: PropTypes.func.isRequired,
		actionPending: PropTypes.bool.isRequired,
		checkedPaths: PropTypes.array,
		isSubmitting: PropTypes.bool.isRequired,
		setSubmitting: PropTypes.func.isRequired,
		values: PropTypes.shape({
			name: PropTypes.string.isRequired,
			path: PropTypes.string.isRequired,
			version: PropTypes.string.isRequired
		}).isRequired,
		setFieldValue: PropTypes.func.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		errors: PropTypes.object.isRequired,
		handleChange: PropTypes.func.isRequired,
		isValid: PropTypes.bool.isRequired
	};

	static defaultProps = {
		children: null,
		buttonText: 'Save',
		checkedPaths: []
	};

	componentDidUpdate(prevProps) {
		const {
			actionPending,
			isSubmitting,
			setSubmitting,
			checkedPaths,
			values,
			setFieldValue
		} = this.props;
		const {actionPending: prevActionPending} = prevProps;

		if (
			actionPending !== prevActionPending &&
			actionPending !== isSubmitting
		) {
			setSubmitting(actionPending);
		}

		const {path, version} = values;

		const matchedPath = R.find(R.propEq('path', path), checkedPaths);
		if (matchedPath && version !== matchedPath.version) {
			setFieldValue('version', matchedPath.version);
		}
	}

	onChange = (e) => {
		if (e.persist) e.persist();

		const {checkInstallPath, handleChange} = this.props;
		const {name, value} = e.target;

		handleChange(e);

		if (name === 'path') {
			checkInstallPath(value);
		}
	};

	render() {
		const {
			children,
			handleSubmit,
			errors,
			values,
			isSubmitting,
			isValid,
			buttonText
		} = this.props;

		return (
			<form onSubmit={handleSubmit}>
				{children}
				<InstallFormFields
					errors={errors}
					values={values}
					onChange={this.onChange}
				/>
				<Button type="submit" disabled={isSubmitting && isValid}>
					{buttonText}
				</Button>
			</form>
		);
	}
}

export default withFormik({
	handleSubmit(values, {props, setSubmitting}) {
		const {submitAction} = props;
		submitAction(R.pick(['name', 'path', 'version'], values));
		setSubmitting(true);
	},
	mapPropsToValues() {
		return {
			name: '',
			path: '',
			version: ''
		};
	},
	validationSchema: schema
})(InstallForm);
