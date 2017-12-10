import { takeEvery } from 'redux-saga'
import { call, take, put, select, spawn } from 'redux-saga/effects'

import * as sagas from './sagas'

import * as eventSelectors from '../events/selectors'
import * as shiftsSelectors from '../shifts/selectors'
import {key as addShiftModal} from '../shifts/containers/AddShiftModalContainer'
import {key as removeShiftModal} from './containers/RemoveShiftModalContainer'

/**
 * This operation handles the UI and async events that compose the group quantity update flow.
 * Flow:
 *   Starts with the user dispatching UPDATE_GROUP__QUANTITY action.
 *   The saga opens the AddShift Modal.
 *   The user decides how he want to update the quantity, or if he want to cancel the operation.
 *   Depending on the decision an async operation is triggered.
 *   The result of the operation is handled.
 * @param action
 */
/*
export function * updateGroupSeriesQuantityOperation (action) {
	const updateOpState = (payload) => put({type: 'UPDATE_GROUP_QUANTITY_SET_STATE', payload})
	const { quantity } = action.payload
	yield put({type: 'UPDATE_GROUP_QUANTITY_SET_STATE', payload: {quantity}})
	yield put({type: 'OPEN_MODAL', payload: {modalType: addShiftModal}})

	// Wait for user interaction, this actions are triggered from addShiftModal.
	const userInteraction = yield take([
		'UPDATE_SINGLE_GROUP_QUANTITY',
		'UPDATE_MULTIPLE_GROUP_QUANTITY',
		'UPDATE_GROUP_QUANTITY_CANCEL'])

	// Handle cancel, when cancelling we clean the state and close the modal.
	if (userInteraction.type === 'UPDATE_GROUP_QUANTITY_CANCEL') {
		yield put({type: 'CLOSE_MODAL'})
		yield put({type: 'UPDATE_GROUP_QUANTITY_RESTORE_STATE'})
		return
	}

	// Start operation
	yield updateOpState({status: 'pending'})
	const editingSchedule = yield select(eventSelectors.scheduleEditingObject)

	// Handle user decision
	if (userInteraction.type === 'UPDATE_SINGLE_GROUP_QUANTITY') {
		yield spawn(sagas.updateSingleGroupQuantity, quantity, editingSchedule)
	}

	// Handle user decision
	if (userInteraction.type === 'UPDATE_MULTIPLE_GROUP_QUANTITY') {
		yield spawn(sagas.updateGroupSeriesQuantity, quantity, editingSchedule)
	}

	// Wait for operation result
	const result = yield take(['UPDATE_GROUP_QUANTITY_SUCCESS', 'UPDATE_GROUP_QUANTITY_FAILURE'])

	// Handle success
	if (result.type === 'UPDATE_GROUP_QUANTITY_SUCCESS') {
		yield updateOpState({status: 'success'})
		yield put({type: 'ON_REFRESH_EVENT_SERIES_GROUPS'})
	}

	// Handle failure, on failure we display an Alert on the modal and wait for the user to close the modal.
	if (result.type === 'UPDATE_GROUP_QUANTITY_FAILURE') {
		yield updateOpState({status: 'failure', error: result.payload.error})
		yield take('UPDATE_GROUP_QUANTITY_CANCEL')
	}
	yield put({type: 'CLOSE_MODAL'})
	yield call(sagas.fetchGroupShiftsWorker)
	yield put({type: 'UPDATE_GROUP_QUANTITY_RESTORE_STATE'})
}

/**
 * This operation handles the UI and async events that compose the unassigned shift removal flow.
 * Flow:
 *   Starts with the user dispatching REMOVE_UNASSIGNED_SHIFT action.
 *   The saga opens the RemoveShift Modal.
 *   The user decides if he want to remove a single shift or this and future shifts, or if he want to cancel the operation.
 *   Depending on the decision an async operation is triggered.
 *   The result of the operation is handled.
 * @param action
 */

/*
export function * removeShiftOperation (action) {
	const { shiftId } = action.payload
	const updateOpState = (payload) => put({type: 'REMOVE_UNASSIGNED_SHIFT_SET_STATE', payload})
	yield put({type: 'REMOVE_UNASSIGNED_SHIFT_SET_STATE', payload: {shiftId}})
	yield put({type: 'OPEN_MODAL', payload: {modalType: removeShiftModal}})
	// Wait for user interaction, this actions are triggered from removeShiftModal
	const shiftRemoval = yield take([
		'REMOVE_UNASSIGNED_SINGLE_SHIFT',
		'REMOVE_UNASSIGNED_UPCOMING_SHIFTS',
		'REMOVE_UNASSIGNED_SHIFT_CANCEL'])

	// Handle cancel, when cancelling we clean the state and close the modal.
	if (shiftRemoval.type === 'REMOVE_UNASSIGNED_SHIFT_CANCEL') {
		yield put({type: 'CLOSE_MODAL'})
		yield put({type: 'REMOVE_UNASSIGNED_SHIFT_RESTORE_STATE'})
		return
	}

	// Start operation
	yield updateOpState({status: 'pending'})
	const editingSchedule = yield select(eventSelectors.scheduleEditingObject)
	// Handle user decision
	if (shiftRemoval.type === 'REMOVE_UNASSIGNED_SINGLE_SHIFT') {
		yield spawn(sagas.removeUnassignedShift, shiftId, editingSchedule)
	}

	// Handle user decision
	if (shiftRemoval.type === 'REMOVE_UNASSIGNED_UPCOMING_SHIFTS') {
		const shift = yield select(shiftsSelectors.shiftById(shiftId))
		yield spawn(sagas.removeUpcomingUnassignedShifts, shift.shiftSeries.shifts, editingSchedule)
	}

	// Wait for operation result
	const result = yield take(['REMOVE_UNASSIGNED_SHIFT_SUCCESS', 'REMOVE_UNASSIGNED_SHIFT_FAILURE'])
	// Handle success
	if (result.type === 'REMOVE_UNASSIGNED_SHIFT_SUCCESS') {
		yield updateOpState({status: 'success'})
		yield put({type: 'ON_REFRESH_EVENT_SERIES_GROUPS'})
	}

	// Handle failure, on failure we display an Alert on the modal and wait for the user to close the modal.
	if (result.type === 'REMOVE_UNASSIGNED_SHIFT_FAILURE') {
		yield updateOpState({status: 'failure', error: result.payload.error})
		yield take('REMOVE_UNASSIGNED_SHIFT_CANCEL')
	}

	// Finally
	yield put({type: 'CLOSE_MODAL'})
	yield call(sagas.fetchGroupShiftsWorker)
	yield put({type: 'REMOVE_UNASSIGNED_SHIFT_RESTORE_STATE'})
}

function * updateGroupSeriesQuantityWatcher () {
	yield takeEvery('UPDATE_GROUP__QUANTITY', updateGroupSeriesQuantityOperation)
}

function * removeShiftWatcher () {
	yield takeEvery('REMOVE_UNASSIGNED_SHIFT', removeShiftOperation)
}

export default [
	removeShiftWatcher,
	updateGroupSeriesQuantityWatcher,
]

*/
