import {Model as ObjectionModel, ValidationError, transaction as objectionTransaction} from 'objection';
import Joi from 'joi';
import _ from 'lodash';

export default class Model extends ObjectionModel {
	$validate(json = this, options = {}) {
		const validatedJson = super.$validate(json, options);
		const joiSchema = this.constructor.joiSchema;
		if (!joiSchema) return validatedJson;

		const result = Joi.validate(json, options.patch ? joiSchema.clone().optionalKeys('') : joiSchema);
		if (result.error) {
			throw new ValidationError(result.error);
		}

		return result.value;
	}

	$formatDatabaseJson(json = {}) {
		const processedJson = super.$formatDatabaseJson(json);
		return _.mapKeys(processedJson, (value, key) => _.snakeCase(key));
	}

	$parseDatabaseJson(json = {}) {
		const processedJson = _.mapKeys(json, (value, key) => _.camelCase(key));
		return super.$parseDatabaseJson(processedJson);
	}

	$beforeInsert() {
		if (!this.created_at) {
			new Date().toISOString();
		}
	}

	$beforeUpdate() {
		this.updated_at = new Date().toISOString();
	}

	update(json = {}) {
		return this.$query().updateAndFetch(json);
	}

	patch(json = {}) {
		return this.$query().patchAndFetch(json);
	}

	static insert(json = {}) {
		return this.query().insert(json);
	}

	static patchById(id, json = {}) {
		return this.query().patchAndFetchById(id, json);
	}

	static deleteById(id) {
		return this.query().deleteById(id);
	}

	static getAll({eager = null} = {}) {
		let query = this.query();
		if (eager) {
			query = query.eager(eager);
		}

		return query;
	}

	static transaction(...args) {
		return objectionTransaction(...args);
	}

	static async optionalTransactionWrap({transaction = null, transacting = false} = {}) {
		if (transaction) return transaction;
		if (transacting) {
			return objectionTransaction.start(this);
		}

		return undefined;
	}
}
