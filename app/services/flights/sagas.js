import { call, cancel, put, take, fork } from 'redux-saga/effects'

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
			EDIT_FLIGHT_DATE_OPERATION: 'EDIT_FLIGHT_DATE_OPERATION',
			SELECT_FLIGHT_MEAL_OPERATION: 'SELECT_FLIGHT_MEAL_OPERATION',
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

export function * bookFlightOperation () {
	const {BOOK_FLIGHT} = OPERATIONS
	yield operationFLow(bookFlight, BOOK_FLIGHT.name, BOOK_FLIGHT.actions, BOOK_FLIGHT.steps)
}
export function * flightEditionOperation () {
	const {FLIGHT_EDITION} = OPERATIONS
	yield operationFLow(editFlight, FLIGHT_EDITION.name, FLIGHT_EDITION.actions, FLIGHT_EDITION.steps)
}

function* bookFlight () {
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

function* editFlight () {
	try {
		const {FLIGHT_EDITION} = OPERATIONS
		const {steps} = FLIGHT_EDITION
		const updateState = builder(FLIGHT_EDITION.name, [])

		const flights = yield call(FlightService.getFlights)
		if (flights.error) {
			return yield put({type: FLIGHT_EDITION.actions.failure, payload: {error: flights.error}})
		}
		yield put(updateState(steps.SELECT_FLIGHT, {flights: flights.res}))
		yield take(steps.SELECT_FLIGHT)
		yield put(updateState(steps.SELECT_OPERATION, {}))
		while (true) {
			const step = yield take([steps.EDIT_FLIGHT_DATE_OPERATION, steps.SELECT_FLIGHT_MEAL_OPERATION])
			yield put(updateState(step.type, {}))
			const context = [FLIGHT_EDITION.name]
			if (step.type === steps.EDIT_FLIGHT_DATE_OPERATION) {
				yield dateEditionOperation(context)
			}
			if (step.type === steps.SELECT_FLIGHT_MEAL_OPERATION) {
				yield mealSelectionOperation(context)
			}
			yield put(updateState(steps.SELECT_OPERATION, {}))
		}

		// yield put({type: actions.success, payload: {}})
	} catch (error) {
		yield put({type: OPERATIONS.FLIGHT_EDITION.actions.failure, payload: {error: 'UNHANDLED ERROR !!!!'}})
	}
}

function * dateEdition (context) {
	try {
		const {EDIT_FLIGHT_DATE} = OPERATIONS
		const updateState = builder(EDIT_FLIGHT_DATE.name, context)
		const {steps} = EDIT_FLIGHT_DATE

		yield put(updateState(steps.SELECT_NEW_DATE, {}))
		yield take(steps.SELECT_NEW_DATE)

		yield put(updateState(steps.EDITION_CONFIRMATION, {}))
		yield take(steps.EDITION_CONFIRMATION)
		yield put({type: EDIT_FLIGHT_DATE.actions.success, payload: {}})
	} catch (error) {
		yield put({type: OPERATIONS.EDIT_FLIGHT_DATE.actions.failure, payload: {error: 'UNHANDLED ERROR !!!!'}})
	}
}

function * mealSelection (context) {
	try {
		const {SELECT_FLIGHT_MEAL} = OPERATIONS
		const updateState = builder(SELECT_FLIGHT_MEAL.name, context)
		const {steps} = SELECT_FLIGHT_MEAL

		yield put(updateState(steps.SELECT_FLIGHT_MEAL, {}))
		yield take(steps.SELECT_FLIGHT_MEAL)

		yield put(updateState(steps.SELECT_FLIGHT_MEAL_CONFIRMATION, {}))
		yield take(steps.SELECT_FLIGHT_MEAL_CONFIRMATION)
		yield put({type: SELECT_FLIGHT_MEAL.actions.success, payload: {}})
	} catch (error) {
		yield put({type: OPERATIONS.SELECT_FLIGHT_MEAL.actions.failure, payload: {error: 'UNHANDLED ERROR !!!!'}})
	}

}

function * dateEditionOperation (context) {
	const {EDIT_FLIGHT_DATE} = OPERATIONS
	yield operationFLow(dateEdition, EDIT_FLIGHT_DATE.name, EDIT_FLIGHT_DATE.actions, EDIT_FLIGHT_DATE.steps, context)
}

function * mealSelectionOperation (context) {
	const {SELECT_FLIGHT_MEAL} = OPERATIONS
	yield operationFLow(mealSelection, SELECT_FLIGHT_MEAL.name, SELECT_FLIGHT_MEAL.actions, SELECT_FLIGHT_MEAL.steps, context)
}

export function* operationFLow (flow, operationName, actions, steps, context = []) {
	yield put({type: 'start_operation', payload: {operation: operationName, step: steps.INITIAL, state: {}, context}})
	const task = yield fork(flow, context)
	const action = yield take([actions.success, actions.cancel, actions.failure])
	if (action.type === actions.success) {
		yield put({type: 'success_operation', payload: {context, operation: operationName}})
		if (actions.successHandled) {
			yield take(actions.successHandled)
			return yield put({type: 'clean_success_operation', payload: {context, operation: operationName}})
		} else return
	}

	if (action.type === actions.failure) {
		yield put({type: 'failure_operation', payload: {context, operation: operationName, error: action.payload.error}})
		yield take(actions.failureHandled)
		return yield put({type: 'clean_failure_operation', payload: {context, operation: operationName}})
	}

	if (action.type === actions.cancel) {
		yield cancel(task)
		return yield put({type: 'cancel_operation', payload: {context, operation: operationName}})
	}
}

const builder = (operation, context = []) => (step, state) => {
	return {
		type: 'update_operation_state',
		payload: {
			context,
			operation,
			state,
			step,
		},
	}
}

const LocationService = {
	getLocations: () => ({res: ['Awesome Places', 'Awesome Locations']}),
	//getLocations: () => ({error: ['Something Happened :(']}),
}

const FlightService = {
	getFlights: () => ({res: ['To Las Canarias', 'To Aruba']}),
	//getLocations: () => ({error: ['Something Happened :(']}),
}
