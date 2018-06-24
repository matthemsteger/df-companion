import yup from 'yup';
import baseModel from './baseModel';

const schema = yup.object({
	installId: yup.string().required()
});

export default baseModel('dwarfFortressActiveInstall', schema);

/*
import Model from './baseModel';

export default class DwarfFortressActiveInstall extends Model {
	static tableName = 'dwarf_fortress_active_installs';
	static joiSchema = null;

	static async setActiveInstall(installId, {transaction = null, transacting = false} = {}) {
		const trx = await this.optionalTransactionWrap({transaction, transacting});
		try {
			const activeInstalls = await this.query(trx).where({id: 0});
			if (activeInstalls.length === 0) {
				await this.query(trx).insert({id: 0, dwarfFortressInstallId: installId});
			} else {
				await this.query(trx)
					.patch({dwarfFortressInstallId: installId})
					.where({id: 0});
			}

			if (trx) {
				await trx.commit();
			}

			return installId;
		} catch (err) {
			if (trx) {
				await trx.rollback();
			}

			throw err;
		}
	}
}
*/
