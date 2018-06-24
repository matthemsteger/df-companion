import baseModel from './baseModel';
import schema from './../schemas/dwarfFortressInstall';

export default baseModel('dwarfFortressInstall', schema);

/*
import Model from './baseModel';
import DwarfFortressActiveInstall from './dwarfFortressActiveInstall';

export default class DwarfFortressInstall extends Model {
	static tableName = 'dwarf_fortress_installs';
	static joiSchema = null;

	static relationMappings = {
		activeInstall: {
			relation: Model.HasOneRelation,
			modelClass: DwarfFortressActiveInstall,
			join: {
				from: 'dwarf_fortress_installs.id',
				to: 'dwarf_fortress_active_installs.dwarf_fortress_install_id'
			}
		}
	}

	static async setActiveInstall(installId, {transaction = null, transacting = false} = {}) {
		return DwarfFortressActiveInstall.setActiveInstall(installId, {transaction, transacting});
	}
}
*/

// really we can have a function that builds on an object
// one is a validator

// decouple the local id to the data, use shortid
