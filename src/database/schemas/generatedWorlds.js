import {timestamps} from './helpers';

export default {
	version: 0,
	type: 'object',
	properties: {
		region: {
			type: 'string',
			primary: true
		},
		worldName: {
			type: 'string'
		},
		friendlyWorldName: {
			type: 'string'
		},
		detailedMapPath: {
			type: 'string'
		},
		worldHistoryPath: {
			type: 'string'
		},
		worldMapPath: {
			type: 'string'
		},
		worldSitesAndPopsPath: {
			type: 'string'
		},
		worldGenParamsPath: {
			type: 'string'
		},
		dwarfFortressInstallId: {
			ref: 'dwarfFOrtressInstalls',
			type: 'string'
		},
		...timestamps
	}
};
