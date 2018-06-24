import yup from 'yup';
import docuri from 'docuri';
import baseModel from './baseModel';

const schema = yup.object();

const idgen = docuri.route('df-install/:dwarfFortressInstallId/generated-world/:id');

export default baseModel('dwarfFortressInstall', schema);

/*
import Model from './baseModel';
import DwarfFortressInstall from './dwarfFortressInstall';

export default class GeneratedWorld extends Model {
	static tableName = 'generated_worlds';
	static joiSchema = null;

	static relationMappings = {
		install: {
			relation: Model.HasOneRelation,
			modelClass: DwarfFortressInstall,
			join: {
				from: 'generated_worlds.dwarf_fortress_install_id',
				to: 'dwarf_fortress_installs.id'
			}
		}
	}
}
*/
