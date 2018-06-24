import {select} from 'redux-most';
import {empty, just as streamOf, from as streamFrom} from 'most';
import R from 'ramda';
import {fold as foldFuture, of as futureOf, value as futureValue, both as bothFutures, and as andFutures, parallel as parallelFutures, reject as rejectedFutureOf, bimap as bimapFuture, mapRej} from 'fluture';
import Maybe from 'folktale/maybe';
import dfTools from 'df-tools';
import toId from 'to-id';
import {errorToAction} from './../../utils';
import {chainWithContext, chainAction, futureToStream, safeDatabaseExec, foldResult, getOrElseMaybe, arrayToMaybe, extractDatabase, foldMaybe, futureToMaybe, orElseMaybe} from './../../epicUtilities';
import constants from './constants';
import {finishCreateInstall, finishDeleteInstall, finishListInstalls, setActiveInstall, finishSetActiveInstall, finishCheckInstallPath, finishReadActiveInstall} from './actionCreators';
import {aliasProp} from './../../../../common/utils/objects';
import {selectActiveInstallId} from './selectors';

const tapDebug = R.tap((x) => console.log(x));

const maybeNoActiveInstallInState = R.compose(
	R.ifElse(R.isNil, Maybe.Just, Maybe.Nothing),
	selectActiveInstallId
);

const maybeSetActiveInstallIfNoneWithNewInstall = R.curry((state, install) =>
	R.compose(
		R.map(R.always(R.compose(setActiveInstall, R.prop('id'))(install))),
		maybeNoActiveInstallInState
	)(state));

const combineMaybeActiveInstallActionAndInstall = R.curry((state, install) => {
	return R.compose(
		R.reject(R.isNil),
		R.append(finishCreateInstall(install)),
		R.of,
		getOrElseMaybe(null),
		maybeSetActiveInstallIfNoneWithNewInstall(state)
	)(install);
});

const deleteMaybeInstallToFutureAction = R.curry((db, maybeInstall) =>
	R.compose(
		foldMaybe(R.always(futureOf(finishDeleteInstall(null))), R.identity),
		R.map(R.compose(R.map(R.compose(finishDeleteInstall, R.prop('id'))), db.DwarfFortressInstall.delete))
	)(maybeInstall));

const deleteInstallActionStream = (db) => R.compose(
	futureToStream,
	R.chain(deleteMaybeInstallToFutureAction(db)),
	db.DwarfFortressInstall.findById
);

export const addInstallEpic = R.compose(
	chainWithContext(({payload: install, db, state}) =>
		R.compose(
			R.chain(R.ifElse(R.is(Array), streamFrom, streamOf)),
			futureToStream,
			foldFuture(errorToAction(finishCreateInstall), R.identity),
			R.map(combineMaybeActiveInstallActionAndInstall(state)),
			db.DwarfFortressInstall.insert
		)(install)),
	select(constants.CREATE_INSTALL)
);

export const removeInstallEpic = R.compose(
	chainWithContext(({payload: installId, db}) =>
		deleteInstallActionStream(db)(installId)),
	select(constants.DELETE_INSTALL)
);

export const listInstallsEpic = R.compose(
	chainWithContext(({db}) => R.compose(
		futureToStream,
		foldFuture((err) => finishListInstalls(err, true), finishListInstalls),
		db.DwarfFortressInstall.fetchAll
	)()),
	select(constants.LIST_INSTALL)
);

const ACTIVE_INSTALL_ID = 'current_active_install';
const updateActiveInstallWithId = (installId) => R.merge(R.__, R.objOf('installId', installId));

/**
 * Set the active install with results from database
 * @private
 * @param {Database} db - database
 * @param {string} installId
 * @param {[Maybe<ActiveInstall>, Install[]]}
 * @returns {Future<ActiveInstall>} The saved active install record
 */
const setActiveInstallWithResultsFromDatabase = R.curry((db, installId, [maybeActiveInstall, installs]) => {
	const insertActiveInstall = R.compose(
		db.DwarfFortressActiveInstall.insert,
		updateActiveInstallWithId(installId),
		R.always(R.objOf('_id', ACTIVE_INSTALL_ID))
	);

	return R.compose(
		getOrElseMaybe(rejectedFutureOf(new Error(`Install ${installId} does not exist`))),
		R.chain(() => {
			return R.compose(
				orElseMaybe(R.compose(Maybe.Just, insertActiveInstall)),
				R.map(R.compose(db.DwarfFortressActiveInstall.update, updateActiveInstallWithId))
			)(maybeActiveInstall);
		}),
		Maybe.fromNullable,
		R.find(R.propEq('id', installId))
	)(installs);
});

/**
 * Set the active install to null
 * @private
 * @param {Database} db - database
 * @param {[Maybe<ActiveInstall>]}
 * @returns {Future<ActiveInstall>} The saved active install record
 */
const removeActiveInstallWithResultsFromDatabase = R.curry((db, [maybeActiveInstall]) =>
	R.compose(
		getOrElseMaybe(R.compose(db.DwarfFortressActiveInstall.insert, updateActiveInstallWithId(null), R.always(R.objOf('_id', ACTIVE_INSTALL_ID)))),
		R.map(R.compose(db.DwarfFortressActiveInstall.update, R.merge(R.__, R.objOf('installId', null))))
	)(maybeActiveInstall));

const setOrRemoveActiveInstall = R.curry((db, installId) =>
	R.ifElse(
		R.always(R.isNil(installId)),
		removeActiveInstallWithResultsFromDatabase(db),
		setActiveInstallWithResultsFromDatabase(db, installId)
	));

export const setActiveInstallEpic = R.compose(
	chainWithContext(({db, payload: installId}) => {
		return R.compose(
			futureToStream,
			foldFuture((err) => finishSetActiveInstall(err, true), R.always(finishSetActiveInstall(installId))),
			R.chain(setOrRemoveActiveInstall(db, installId)),
			R.converge(bothFutures, [R.always(db.DwarfFortressActiveInstall.findById(ACTIVE_INSTALL_ID)), db.DwarfFortressInstall.fetchAll])
		)();
	}),
	select(constants.SET_ACTIVE_INSTALL)
);

export const getActiveInstallEpic = R.compose(
	chainWithContext(({db}) => {
		return R.compose(
			futureToStream,
			foldFuture(errorToAction(finishReadActiveInstall), finishReadActiveInstall),
			R.map(getOrElseMaybe(null)),
			db.DwarfFortressActiveInstall.findById
		)(ACTIVE_INSTALL_ID);
	}),
	select(constants.READ_ACTIVE_INSTALL)
);

export const checkInstallPathEpic = R.compose(
	R.chain(R.compose(
		futureToStream,
		foldFuture((err) => finishCheckInstallPath(err, true), finishCheckInstallPath),
		dfTools.install.discoverInstall,
		(dfRootPath) => ({dfRootPath}),
		R.prop('payload')
	)),
	select(constants.CHECK_PATH)
);
