import R from 'ramda';
import {encaseP, tryP, map as mapFuture, chainRej, of as futureOf, reject as rejectedFutureOf} from 'fluture';
import Maybe from 'folktale/maybe';
import shortid from 'shortid';
import {aliasProp} from './../../common/utils/objects';

const tapDebug = R.tap((x) => console.log(x));

export const operations = {
	insert: 'insert',
	get: 'get',
	delete: 'delete',
	update: 'update'
};

const isValidationOperation = R.anyPass([R.equals(operations.insert), R.equals(operations.update)]);

const makeValidationMiddleware = R.cond([
	[R.is(Function), R.identity],
	[R.propIs(Function, 'validate'), (schema) => (value, operation) => R.when(
		R.always(isValidationOperation(operation)), schema.validate(value)
	)(value)],
	[R.T, R.always]
]);

const idGenerator = R.converge(R.merge, [R.identity, R.compose(R.objOf('_id'), R.nAry(0, shortid.generate))]);
const addIdIfNeeded = R.unless(R.has('_id'), idGenerator);
const addType = R.curry((type, doc) => R.merge(doc, R.objOf('type', type)));
const getId = R.prop('id');
const aliasId = aliasProp('_id', 'id');
const aliasAllIds = R.map(aliasId);

export default R.curry((type, validation, db) => {
	let fetchMiddleware = [];
	let sendMiddleware = [makeValidationMiddleware(validation)];
	const getFuture = encaseP(db.get.bind(db));
	const findFuture = encaseP(db.find.bind(db));
	const putFuture = encaseP(db.put.bind(db));
	const addTypeToDoc = addType(type);
	const getDocFromIdResponse = R.compose(R.map(aliasId), getFuture, getId);

	const findByObjMatch = R.compose(
		R.map(R.compose(aliasAllIds, R.prop('docs'))),
		findFuture,
		R.objOf('selector'),
		R.merge({type})
	);

	const findById = R.compose(
		chainRej(R.ifElse(R.propEq('status', 404), R.always(futureOf(Maybe.Nothing())), rejectedFutureOf)),
		R.map(R.compose(Maybe.Just, aliasId)),
		getFuture
	);

	const update = R.compose(
		R.chain(getDocFromIdResponse),
		putFuture,
		tapDebug,
		addTypeToDoc
	);

	const insert = R.compose(
		update,
		addIdIfNeeded
	);

	const fetchAll = R.compose(findByObjMatch, R.always({}));

	const deleteDoc = R.compose(
		R.map(aliasId),
		putFuture,
		R.merge(R.__, {_deleted: true})
	);

	return {
		insert,
		update,
		fetchAll,
		findById,
		findByObjMatch,
		delete: deleteDoc,
		addFetchMiddleware(middleware, idx = -1) {
			fetchMiddleware = R.insert(idx, middleware, fetchMiddleware);
		},
		addSendMiddleware(middleware, idx = -1) {
			sendMiddleware = R.insert(idx, middleware, sendMiddleware);
		}
	};
});

/*
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
*/
