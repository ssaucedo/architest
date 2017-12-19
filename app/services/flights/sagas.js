import { call, put, take } from 'redux-saga/effects'
import {builder} from '../../operations/opsSaga'

export const OPERATIONS = {
	BOOK_FLIGHT: {
		name: 'BOOK_FLIGHT',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_DATES: 'SELECT_DATES',
			SELECT_ORIGIN: 'SELECT_ORIGIN',
			SELECT_DESTINATION: 'SELECT_DESTINATION',
			FLIGHT_CONFIRMATION: 'FLIGHT_CONFIRMATION',
		},
		actions: {
			cancel: 'BOOK_FLIGHT_CANCEL',
			success: 'BOOK_FLIGHT_SUCCESS',
			failure: 'BOOK_FLIGHT_FAILURE',
			failureHandled: 'BOOK_FLIGHT_FAILURE_HANDLED',
			successHandled: 'BOOK_FLIGHT_SUCCESS_HANDLED',
		},
	},
	FLIGHT_EDITION: {
		name: 'FLIGHT_EDITION',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_FLIGHT: 'SELECT_FLIGHT',
			SELECT_OPERATION: 'SELECT_OPERATION',
			EDIT_FLIGHT_DECISION: {
				EDIT_FLIGHT_DATE_OPERATION: 'EDIT_FLIGHT_DATE_OPERATION',
				SELECT_FLIGHT_MEAL_OPERATION: 'SELECT_FLIGHT_MEAL_OPERATION',
			},
			EDITION_CONFIRMATION: 'EDITION_CONFIRMATION',
		},
		actions: {
			cancel: 'FLIGHT_EDITION_CANCEL',
			success: 'FLIGHT_EDITION_SUCCESS',
			failure: 'FLIGHT_EDITION_FAILURE',
			successHandled: 'FLIGHT_EDITION_SUCCESS_HANDLED',
			failureHandled: 'FLIGHT_EDITION_FAILURE_HANDLED',
		},
	},
	EDIT_FLIGHT_DATE: {
		name: 'EDIT_FLIGHT_DATE',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_NEW_DATE: 'SELECT_NEW_DATE',
			EDIT_DATE_CONFIRMATION: 'EDIT_FLIGHT_DATE_CONFIRMATION',
		},
		actions: {
			cancel: 'EDIT_FLIGHT_DATE_CANCEL',
			success: 'EDIT_FLIGHT_DATE_SUCCESS',
			failure: 'EDIT_FLIGHT_DATE_FAILURE',
			successHandled: 'EDIT_FLIGHT_DATE_SUCCESS_HANDLED',
			failureHandled: 'EDIT_FLIGHT_DATE_FAILURE_HANDLED',
		},
	},
	SELECT_FLIGHT_MEAL: {
		name: 'SELECT_FLIGHT_MEAL',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_FLIGHT_MEAL: 'SELECT_FLIGHT_MEAL',
			SELECT_FLIGHT_MEAL_CONFIRMATION: 'SELECT_FLIGHT_MEAL_CONFIRMATION',
		},
		actions: {
			cancel: 'SELECT_FLIGHT_MEAL_CANCEL',
			success: 'SELECT_FLIGHT_MEAL_SUCCESS',
			failure: 'SELECT_FLIGHT_MEAL_FAILURE',
			successHandled: 'SELECT_FLIGHT_MEAL_SUCCESS_HANDLED',
			failureHandled: 'SELECT_FLIGHT_MEAL_FAILURE_HANDLED',
		},
	},
}

export function* bookFlight () {
	try {
		const {BOOK_FLIGHT} = OPERATIONS
		const {steps} = BOOK_FLIGHT
		const updateState = builder(BOOK_FLIGHT.name)

		yield put(updateState(BOOK_FLIGHT.steps.SELECT_DATES, {}))
		yield take(steps.SELECT_DATES)

		const locations = yield call(LocationService.getLocations)
		if (locations.error) {
			return yield put({type: BOOK_FLIGHT.actions.failure, payload: {error: locations.error}})
		}

		yield put(updateState(BOOK_FLIGHT.steps.SELECT_ORIGIN, {locations: locations.res}))
		yield take(steps.SELECT_ORIGIN)

		yield put(updateState(BOOK_FLIGHT.steps.SELECT_DESTINATION, {origin: 'Toronto'}))
		yield take(steps.SELECT_DESTINATION)

		yield put(updateState(BOOK_FLIGHT.steps.FLIGHT_CONFIRMATION, {destination: 'Buenos Aires'}))
		yield take(steps.FLIGHT_CONFIRMATION)

		yield put({type: BOOK_FLIGHT.actions.success, payload: {}})
	} catch (error) {
			yield put({type: OPERATIONS.BOOK_FLIGHT.actions.failure, payload: {error: 'UNHANDLED ERROR !!!!'}})
	}
}

const LocationService = {
	getLocations: () => ({res: ['Awesome Places', 'Awesome Locations']}),
	//getLocations: () => ({error: ['Something Happened :(']}),
}
