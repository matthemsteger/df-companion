import {select} from 'redux-most';
import {just as streamOf, from as streamFrom} from 'most';
import {
	compose,
	ifElse,
	isNil,
	map,
	curry,
	always,
	prop,
	reject,
	append,
	of as arrayOf,
	identity,
	chain,
	is,
	__ as placeholder,
	objOf,
	merge,
	find,
	propEq,
	converge
} from 'ramda';
import {
	fold as foldFuture,
	of as futureOf,
	both as bothFutures,
	reject as rejectedFutureOf
} from 'fluture';
import Maybe from 'folktale/maybe';
import dfTools from 'df-tools';
import {errorToAction} from '@matthemsteger/redux-utils-fn-actions';
import {
	chainWithContext,
	futureToStream,
	getOrElseMaybe,
	foldMaybe,
	orElseMaybe
} from './../../epicUtilities';
import constants from './constants';
import {
	finishCreateInstall,
	finishDeleteInstall,
	finishListInstalls,
	setActiveInstall,
	finishSetActiveInstall,
	finishCheckInstallPath,
	finishReadActiveInstall
} from './actionCreators';
import {selectActiveInstallId} from './selectors';

const maybeNoActiveInstallInState = compose(
	ifElse(isNil, Maybe.Just, Maybe.Nothing),
	selectActiveInstallId
);

const maybeSetActiveInstallIfNoneWithNewInstall = curry((state, install) =>
	compose(
		map(
			always(
				compose(
					setActiveInstall,
					prop('id')
				)(install)
			)
		),
		maybeNoActiveInstallInState
	)(state)
);

const combineMaybeActiveInstallActionAndInstall = curry((state, install) =>
	compose(
		reject(isNil),
		append(finishCreateInstall(install)),
		arrayOf,
		getOrElseMaybe(null),
		maybeSetActiveInstallIfNoneWithNewInstall(state)
	)(install)
);

const deleteMaybeInstallToFutureAction = curry((db, maybeInstall) =>
	compose(
		foldMaybe(always(futureOf(finishDeleteInstall(null))), identity),
		map(
			compose(
				map(
					compose(
						finishDeleteInstall,
						prop('id')
					)
				),
				db.DwarfFortressInstall.delete
			)
		)
	)(maybeInstall)
);

const deleteInstallActionStream = (db) =>
	compose(
		futureToStream,
		chain(deleteMaybeInstallToFutureAction(db)),
		db.DwarfFortressInstall.findById
	);

export const addInstallEpic = compose(
	chainWithContext(({payload: install, db, state}) =>
		compose(
			chain(ifElse(is(Array), streamFrom, streamOf)),
			futureToStream,
			foldFuture(errorToAction(finishCreateInstall), identity),
			map(combineMaybeActiveInstallActionAndInstall(state)),
			db.DwarfFortressInstall.insert
		)(install)
	),
	select(constants.CREATE_INSTALL)
);

export const removeInstallEpic = compose(
	chainWithContext(({payload: installId, db}) =>
		deleteInstallActionStream(db)(installId)
	),
	select(constants.DELETE_INSTALL)
);

export const listInstallsEpic = compose(
	chainWithContext(({db}) =>
		compose(
			futureToStream,
			foldFuture(
				(err) => finishListInstalls(err, true),
				finishListInstalls
			),
			db.DwarfFortressInstall.fetchAll
		)()
	),
	select(constants.LIST_INSTALL)
);

const ACTIVE_INSTALL_ID = 'current_active_install';
const updateActiveInstallWithId = (installId) =>
	merge(placeholder, objOf('installId', installId));

/**
 * Set the active install with results from database
 * @private
 * @param {Database} db - database
 * @param {string} installId
 * @param {[Maybe<ActiveInstall>, Install[]]}
 * @returns {Future<ActiveInstall>} The saved active install record
 */
const setActiveInstallWithResultsFromDatabase = curry(
	(db, installId, [maybeActiveInstall, installs]) => {
		const insertActiveInstall = compose(
			db.DwarfFortressActiveInstall.insert,
			updateActiveInstallWithId(installId),
			always(objOf('_id', ACTIVE_INSTALL_ID))
		);

		return compose(
			getOrElseMaybe(
				rejectedFutureOf(
					new Error(`Install ${installId} does not exist`)
				)
			),
			chain(() =>
				compose(
					orElseMaybe(
						compose(
							Maybe.Just,
							insertActiveInstall
						)
					),
					map(
						compose(
							db.DwarfFortressActiveInstall.update,
							updateActiveInstallWithId
						)
					)
				)(maybeActiveInstall)
			),
			Maybe.fromNullable,
			find(propEq('id', installId))
		)(installs);
	}
);

/**
 * Set the active install to null
 * @private
 * @param {Database} db - database
 * @param {[Maybe<ActiveInstall>]}
 * @returns {Future<ActiveInstall>} The saved active install record
 */
const removeActiveInstallWithResultsFromDatabase = curry(
	(db, [maybeActiveInstall]) =>
		compose(
			getOrElseMaybe(
				compose(
					db.DwarfFortressActiveInstall.insert,
					updateActiveInstallWithId(null),
					always(objOf('_id', ACTIVE_INSTALL_ID))
				)
			),
			map(
				compose(
					db.DwarfFortressActiveInstall.update,
					merge(placeholder, objOf('installId', null))
				)
			)
		)(maybeActiveInstall)
);

const setOrRemoveActiveInstall = curry((db, installId) =>
	ifElse(
		always(isNil(installId)),
		removeActiveInstallWithResultsFromDatabase(db),
		setActiveInstallWithResultsFromDatabase(db, installId)
	)
);

export const setActiveInstallEpic = compose(
	chainWithContext(({db, payload: installId}) =>
		compose(
			futureToStream,
			foldFuture(
				(err) => finishSetActiveInstall(err, true),
				always(finishSetActiveInstall(installId))
			),
			chain(setOrRemoveActiveInstall(db, installId)),
			converge(bothFutures, [
				always(
					db.DwarfFortressActiveInstall.findById(ACTIVE_INSTALL_ID)
				),
				db.DwarfFortressInstall.fetchAll
			])
		)()
	),
	select(constants.SET_ACTIVE_INSTALL)
);

export const getActiveInstallEpic = compose(
	chainWithContext(({db}) =>
		compose(
			futureToStream,
			foldFuture(
				errorToAction(finishReadActiveInstall),
				finishReadActiveInstall
			),
			map(getOrElseMaybe(null)),
			db.DwarfFortressActiveInstall.findById
		)(ACTIVE_INSTALL_ID)
	),
	select(constants.READ_ACTIVE_INSTALL)
);

export const checkInstallPathEpic = compose(
	chain(
		compose(
			futureToStream,
			foldFuture(
				(err) => finishCheckInstallPath(err, true),
				finishCheckInstallPath
			),
			dfTools.install.discoverInstall,
			(dfRootPath) => ({dfRootPath}),
			prop('payload')
		)
	),
	select(constants.CHECK_PATH)
);
