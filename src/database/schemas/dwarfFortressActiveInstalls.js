import * as yup from 'yup';
import {timestamps} from './helpers';

export default yup.object().shape({
	version: yup.number.required
});

export default {
	version: 0,
	type: 'object',
	properties: {
		id: {
			type: 'string',
			primary: true
		},
		dwarfFortressInstallId: {
			ref: 'dwarfFortressInstalls',
			type: 'string'
		},
		...timestamps
	}
};
