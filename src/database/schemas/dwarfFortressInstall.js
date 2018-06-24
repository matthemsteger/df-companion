import * as yup from 'yup';

export default yup.object().shape({
	name: yup.string().required(),
	path: yup.string().required(),
	version: yup.string().required()
});
